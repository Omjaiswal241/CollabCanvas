import { useEffect, useCallback } from "react";
import { canvasUtils } from "@/utils/canvasUtils";
import type { Shape } from "@/types/room";

interface UseCanvasResizeProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  shapes: Shape[];
  showChat: boolean;
}

export const useCanvasResize = ({
  canvasRef,
  canvasContainerRef,
  shapes,
  showChat,
}: UseCanvasResizeProps) => {
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    
    if (canvas && container) {
      const rect = container.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;
      
      if (newWidth <= 0 || newHeight <= 0) return;
      
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        const currentShapes = [...shapes];
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvasUtils.initializeContext(canvas);
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          currentShapes.forEach(shape => {
            canvasUtils.drawShape(ctx, shape);
          });
        }
      }
    }
  }, [canvasRef, canvasContainerRef, shapes]);

  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvasUtils.initializeContext(canvas);
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    }
  }, [canvasRef, resizeCanvas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      resizeCanvas();
    }, 50);
    return () => clearTimeout(timer);
  }, [showChat, resizeCanvas]);

  useEffect(() => {
    if (shapes.length > 0) {
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    }
  }, [shapes.length, resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvasUtils.redrawCanvas(canvas, shapes);
    }
  }, [shapes, canvasRef]);

  return { resizeCanvas };
};
