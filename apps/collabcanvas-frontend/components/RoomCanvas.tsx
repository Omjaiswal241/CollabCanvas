"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      
      ws.onopen = () => {
        setSocket(ws);
        const data = JSON.stringify({
          type: "join_room",
          roomId,
        });
        ws.send(data);
      };

      ws.onerror = () => {
        setError("Failed to connect to server");
      };

      ws.onclose = () => {
        setError("Connection closed");
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (e) {
      setError("Failed to establish connection");
    }
  }, [roomId, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Connecting to server....</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}