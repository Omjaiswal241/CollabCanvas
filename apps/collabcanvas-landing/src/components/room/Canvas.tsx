import { Card, CardContent } from "@/components/ui/card";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const Canvas = ({
  canvasRef,
  canvasContainerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: CanvasProps) => {
  return (
    <Card className="flex-1 bg-zinc-900 border-zinc-800 overflow-hidden">
      <CardContent className="p-0 h-full" ref={canvasContainerRef}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair bg-black"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </CardContent>
    </Card>
  );
};
