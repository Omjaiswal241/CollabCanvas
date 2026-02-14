import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Home, MessageSquare } from "lucide-react";

interface RoomHeaderProps {
  roomSlug: string;
  showChat: boolean;
  onToggleChat: () => void;
}

export const RoomHeader = ({ roomSlug, showChat, onToggleChat }: RoomHeaderProps) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Pencil className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-white">CollabCanvas</span>
          </Link>
          <span className="text-zinc-500">|</span>
          <span className="font-medium text-white">{roomSlug}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleChat}
            className="text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {showChat ? "Hide" : "Show"} Chat
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
