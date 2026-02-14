import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Send, Loader2 } from "lucide-react";
import type { Message } from "@/types/room";

interface ChatPanelProps {
  messages: Message[];
  newMessage: string;
  sending: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export const ChatPanel = ({
  messages,
  newMessage,
  sending,
  onMessageChange,
  onSendMessage,
}: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  return (
    <div className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="border-b border-zinc-800 p-4">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <Users className="h-5 w-5" />
          Chat
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-zinc-400">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-3">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm font-medium text-white">
                  {msg.user?.name || "User"}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-zinc-200">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 p-4 bg-zinc-900">
        <form onSubmit={onSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
