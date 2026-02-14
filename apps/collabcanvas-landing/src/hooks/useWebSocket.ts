import { useEffect, useRef, useCallback, useState } from "react";
import { WS_URL } from "@/lib/config";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot connect to WebSocket");
      return;
    }

    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        
        // Rejoin room if we were in one
        if (currentRoomId) {
          ws.send(JSON.stringify({
            type: "join_room",
            roomId: currentRoomId,
          }));
        }
        
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        wsRef.current = null;
        onDisconnect?.();

        // Auto-reconnect
        if (autoReconnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, [onMessage, onConnect, onDisconnect, autoReconnect, reconnectInterval, currentRoomId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  const joinRoom = useCallback((roomId: string | number) => {
    const roomIdStr = String(roomId);
    setCurrentRoomId(roomIdStr);
    sendMessage({
      type: "join_room",
      roomId: roomIdStr,
    });
  }, [sendMessage]);

  const leaveRoom = useCallback((roomId: string | number) => {
    sendMessage({
      type: "leave_room",
      room: String(roomId),
    });
    setCurrentRoomId(null);
  }, [sendMessage]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    reconnect: connect,
  };
};
