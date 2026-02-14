import type { Shape } from "@/types/room";

export const canvasUtils = {
  drawShape(ctx: CanvasRenderingContext2D, shape: Shape): void {
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";

    const [x1, y1, x2, y2] = shape.points;
    const width = x2 - x1;
    const height = y2 - y1;

    switch (shape.type) {
      case "rectangle":
        ctx.strokeRect(x1, y1, width, height);
        ctx.fillRect(x1, y1, width, height);
        break;
      
      case "circle": {
        const circleCenterX = x1 + width / 2;
        const circleCenterY = y1 + height / 2;
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
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        break;
      
      case "triangle": {
        const centerX = x1 + width / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, y1);
        ctx.lineTo(x1, y1 + height);
        ctx.lineTo(x1 + width, y1 + height);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        break;
      }
      
      case "freehand":
        if (shape.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0], shape.points[1]);
          for (let i = 2; i < shape.points.length; i += 2) {
            ctx.lineTo(shape.points[i], shape.points[i + 1]);
          }
          ctx.stroke();
        }
        break;

      case "text":
        if (shape.text) {
          ctx.font = "italic 24px Arial";
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(shape.text, x1, y1);
        }
        break;
    }
  },

  isPointInShape(x: number, y: number, shape: Shape, canvas: HTMLCanvasElement): boolean {
    const [x1, y1, x2, y2] = shape.points;
    
    switch (shape.type) {
      case "rectangle":
        return x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
               y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
      
      case "circle": {
        const centerX = x1 + (x2 - x1) / 2;
        const centerY = y1 + (y2 - y1) / 2;
        const radiusX = Math.abs(x2 - x1) / 2;
        const radiusY = Math.abs(y2 - y1) / 2;
        const radius = Math.min(radiusX, radiusY);
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return dist <= radius;
      }
      
      case "line": {
        const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const distToLine = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / lineLength;
        return distToLine <= 5;
      }
      
      case "triangle":
        return x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
               y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
      
      case "text": {
        if (!shape.text) return false;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;
        
        ctx.font = "italic 24px Arial";
        const textWidth = ctx.measureText(shape.text).width;
        const textHeight = 24;
        
        return x >= x1 && x <= x1 + textWidth &&
               y >= y1 - textHeight && y <= y1;
      }
      
      default:
        return false;
    }
  },

  redrawCanvas(canvas: HTMLCanvasElement, shapes: Shape[], excludeId?: number): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    shapes.forEach(shape => {
      if (excludeId !== undefined && shape.id === excludeId) return;
      canvasUtils.drawShape(ctx, shape);
    });
  },

  initializeContext(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  },
};
