import { useState, useEffect, useCallback } from "react";
import { canvasService } from "@/services/canvasService";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import type { Shape } from "@/types/room";

export const useCanvasData = (roomId: number | undefined) => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: any) => {
    if (!roomId) return;
    
    const messageRoomId = String(message.roomId);
    const currentRoomId = String(roomId);
    
    if (messageRoomId !== currentRoomId) return;

    if (message.type === "draw") {
      // Add new shape from another user
      const newShape = message.data;
      setShapes((prev) => {
        // Check if shape already exists by id
        if (prev.some(s => s.id === newShape.id)) {
          return prev;
        }
        return [...prev, newShape];
      });
    } else if (message.type === "erase") {
      // Remove shape
      const shapeToRemove = message.data;
      setShapes((prev) => prev.filter(s => s.id !== shapeToRemove.id && s.dbId !== shapeToRemove.dbId));
    } else if (message.type === "clear") {
      // Clear all shapes
      setShapes([]);
    }
  }, [roomId]);

  const { sendMessage, isConnected, subscribe } = useWebSocketContext();

  // Subscribe to WebSocket messages
  useEffect(() => {
    const unsubscribe = subscribe(handleWebSocketMessage);
    return unsubscribe;
  }, [subscribe, handleWebSocketMessage]);

  const fetchCanvasData = useCallback(async () => {
    if (!roomId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const loadedShapes = await canvasService.fetchCanvasData(roomId, token);
    if (loadedShapes.length > 0) {
      setShapes(loadedShapes);
    }
  }, [roomId]);

  const saveShape = useCallback(async (shape: Shape): Promise<number | null> => {
    if (!roomId) return null;

    const token = localStorage.getItem("token");
    if (!token) return null;

    // Save to database via HTTP
    const dbId = await canvasService.saveShape(roomId, shape, token);
    
    // Broadcast to other users via WebSocket
    if (isConnected) {
      sendMessage({
        type: "draw",
        roomId: String(roomId),
        data: { ...shape, dbId },
      });
    }
    
    return dbId;
  }, [roomId, isConnected, sendMessage]);

  const deleteShape = useCallback(async (dbId: number): Promise<void> => {
    if (!roomId || !dbId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    await canvasService.deleteShape(roomId, dbId, token);
    
    // Broadcast deletion to other users via WebSocket
    if (isConnected) {
      sendMessage({
        type: "erase",
        roomId: String(roomId),
        data: { dbId },
      });
    }
  }, [roomId, isConnected, sendMessage]);

  const clearAllShapes = useCallback(async (): Promise<void> => {
    if (!roomId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    await canvasService.clearCanvas(roomId, token);
    setShapes([]);
    
    // Broadcast clear to other users via WebSocket
    if (isConnected) {
      sendMessage({
        type: "clear",
        roomId: String(roomId),
        data: {},
      });
    }
  }, [roomId, isConnected, sendMessage]);

  // Fetch initial data when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchCanvasData();
    }
  }, [roomId, fetchCanvasData]);

  return {
    shapes,
    setShapes,
    saveShape,
    deleteShape,
    clearAllShapes,
    isConnected,
  };
};
