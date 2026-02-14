import { Button } from "@/components/ui/button";
import type { DrawingTool } from "@/types/room";

interface DrawingToolbarProps {
  currentTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClear: () => void;
}

export const DrawingToolbar = ({ currentTool, onToolChange, onClear }: DrawingToolbarProps) => {
  const tools: { tool: DrawingTool; label: string }[] = [
    { tool: "pencil", label: "✏️ Pencil" },
    { tool: "eraser", label: "🧽 Eraser" },
    { tool: "rectangle", label: "▭ Rectangle" },
    { tool: "circle", label: "⭕ Circle" },
    { tool: "line", label: "─ Line" },
    { tool: "triangle", label: "△ Triangle" },
    { tool: "text", label: "📝 Text" },
  ];

  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      {tools.map(({ tool, label }) => (
        <Button
          key={tool}
          size="sm"
          variant={currentTool === tool ? "default" : "outline"}
          onClick={() => onToolChange(tool)}
          className={
            currentTool === tool
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "text-teal-400 border-teal-600 hover:bg-teal-900/50 hover:text-teal-300"
          }
        >
          {label}
        </Button>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={onClear}
        className="text-teal-400 border-teal-600 hover:bg-teal-900/50 hover:text-teal-300"
      >
        🗑️ Clear
      </Button>
    </div>
  );
};
