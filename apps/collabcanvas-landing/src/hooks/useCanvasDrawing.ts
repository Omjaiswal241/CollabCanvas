import { useState, useCallback, useRef } from "react";
import { canvasUtils } from "@/utils/canvasUtils";
import type { DrawingTool, Shape } from "@/types/room";

interface UseCanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  saveShape: (shape: Shape) => Promise<number | null>;
  deleteShape: (dbId: number) => Promise<void>;
}

export const useCanvasDrawing = ({
  canvasRef,
  shapes,
  setShapes,
  saveShape,
  deleteShape,
}: UseCanvasDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("pencil");
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasState, setCanvasState] = useState<ImageData | null>(null);

  const startDrawing = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (currentTool === "text") {
      const text = prompt("Enter text:");
      if (text && text.trim()) {
        const newShape: Shape = {
          type: "text",
          points: [x, y, x, y],
          id: Date.now(),
          text: text.trim(),
          dbId: undefined
        };
        
        ctx.font = "italic 24px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(text.trim(), x, y);
        
        const dbId = await saveShape(newShape);
        if (dbId) {
          newShape.dbId = dbId;
        }
        setShapes(prev => [...prev, newShape]);
      }
      return;
    }

    if (currentTool === "eraser") {
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (canvasUtils.isPointInShape(x, y, shapes[i], canvas)) {
          const shapeToDelete = shapes[i];
          setShapes(shapes.filter((_, idx) => idx !== i));
          canvasUtils.redrawCanvas(canvas, shapes, shapeToDelete.id);
          
          if (shapeToDelete.dbId) {
            deleteShape(shapeToDelete.dbId);
          }
          return;
        }
      }
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
      return;
    }

    setIsDrawing(true);

    if (["rectangle", "circle", "line", "triangle"].includes(currentTool)) {
      setStartPos({ x, y });
      setCanvasState(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, [canvasRef, currentTool, shapes, setShapes, saveShape, deleteShape]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (currentTool === "pencil" || currentTool === "eraser") {
      ctx.strokeStyle = currentTool === "pencil" ? "#FFFFFF" : "#000000";
      ctx.lineWidth = currentTool === "pencil" ? 2 : 10;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (startPos && canvasState) {
      ctx.putImageData(canvasState, 0, 0);
      
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";

      const width = x - startPos.x;
      const height = y - startPos.y;

      switch (currentTool) {
        case "rectangle":
          ctx.strokeRect(startPos.x, startPos.y, width, height);
          ctx.fillRect(startPos.x, startPos.y, width, height);
          break;
        
        case "circle": {
          const circleCenterX = startPos.x + width / 2;
          const circleCenterY = startPos.y + height / 2;
          const radiusX = Math.abs(width) / 2;
          const radiusY = Math.abs(height) / 2;
          const radius = Math.min(radiusX, radiusY);
          
          ctx.beginPath();
          ctx.arc(circleCenterX, circleCenterY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          break;
        }
        
        case "line":
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          break;
        
        case "triangle": {
          const centerX = startPos.x + width / 2;
          ctx.beginPath          ();
          ctx.moveTo(centerX, startPos.y);
          ctx.lineTo(startPos.x, startPos.y + height);
          ctx.lineTo(startPos.x + width, startPos.y + height);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
          break;
        }
      }
    }
  }, [isDrawing, canvasRef, currentTool, startPos, canvasState]);

  const stopDrawing = useCallback(async (e?: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    if (startPos && e && ["rectangle", "circle", "line", "triangle"].includes(currentTool)) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newShape: Shape = {
          type: currentTool as "rectangle" | "circle" | "line" | "triangle",
          points: [startPos.x, startPos.y, x, y],
          id: Date.now(),
          dbId: undefined
        };
        
        const dbId = await saveShape(newShape);
        if (dbId) {
          newShape.dbId = dbId;
        }
        setShapes(prev => [...prev, newShape]);
      }
    }
    
    setIsDrawing(false);
    setStartPos(null);
    setCanvasState(null);
  }, [isDrawing, startPos, currentTool, canvasRef, setShapes, saveShape]);

  return {
    currentTool,
    setCurrentTool,
    startDrawing,
    draw,
    stopDrawing,
  };
};
