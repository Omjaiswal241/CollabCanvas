import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { roomService } from "@/services/roomService";
import { useCanvasData } from "@/hooks/useCanvasData";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasResize } from "@/hooks/useCanvasResize";
import { useChat } from "@/hooks/useChat";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { RoomHeader } from "@/components/room/RoomHeader";
import { DrawingToolbar } from "@/components/room/DrawingToolbar";
import { Canvas } from "@/components/room/Canvas";
import { ChatPanel } from "@/components/room/ChatPanel";
import type { RoomData } from "@/types/room";

const Room = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { joinRoom, leaveRoom } = useWebSocketContext();
  const { shapes, setShapes, saveShape, deleteShape, clearAllShapes } = useCanvasData(room?.id);
  const { messages, newMessage, setNewMessage, sending, sendMessage } = useChat(room?.id);

  const { currentTool, setCurrentTool, startDrawing, draw, stopDrawing } = useCanvasDrawing({
    canvasRef,
    shapes,
    setShapes,
    saveShape,
    deleteShape,
  });

  useCanvasResize({
    canvasRef,
    canvasContainerRef,
    shapes,
    showChat,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (slug) {
      roomService.fetchRoom(slug).then((roomData) => {
        if (roomData) {
          setRoom(roomData);
        } else {
          navigate("/dashboard");
        }
        setLoading(false);
      });
    }
  }, [slug, navigate]);

  // Join room when room is loaded
  useEffect(() => {
    if (room?.id) {
      joinRoom(room.id);
      return () => {
        leaveRoom(room.id);
      };
    }
  }, [room?.id, joinRoom, leaveRoom]);

  const handleClearCanvas = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    await clearAllShapes();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Room not found</p>
            <Button className="mt-4 w-full" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <RoomHeader roomSlug={room.slug} showChat={showChat} onToggleChat={() => setShowChat(!showChat)} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col bg-zinc-950 p-4">
          <DrawingToolbar
            currentTool={currentTool}
            onToolChange={setCurrentTool}
            onClear={handleClearCanvas}
          />

          <Canvas
            canvasRef={canvasRef}
            canvasContainerRef={canvasContainerRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {showChat && (
          <ChatPanel
            messages={messages}
            newMessage={newMessage}
            sending={sending}
            onMessageChange={setNewMessage}
            onSendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Room;
