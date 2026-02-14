import { useState, useEffect, useCallback } from "react";
import { chatService } from "@/services/chatService";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import type { Message } from "@/types/room";

export const useChat = (roomId: number | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: any) => {
    if (!roomId) return;
    
    const messageRoomId = String(message.roomId);
    const currentRoomId = String(roomId);
    
    if (messageRoomId !== currentRoomId) return;

    if (message.type === "chat") {
      // Add new message from WebSocket
      const newMsg: Message = {
        id: message.chatId,
        message: message.message,
        userId: message.userId,
        createdAt: message.createdAt,
        user: {
          name: message.userName,
        },
      };
      
      setMessages((prev) => {
        // Check if message already exists by id
        if (prev.some(m => m.id === newMsg.id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
    }
  }, [roomId]);

  const { sendMessage: wsSendMessage, isConnected, subscribe } = useWebSocketContext();

  // Subscribe to WebSocket messages
  useEffect(() => {
    const unsubscribe = subscribe(handleWebSocketMessage);
    return unsubscribe;
  }, [subscribe, handleWebSocketMessage]);

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    const msgs = await chatService.fetchMessages(roomId);
    setMessages(msgs);
  }, [roomId]);

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

    setSending(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setSending(false);
      return;
    }

    // Send via WebSocket for real-time delivery
    if (isConnected) {
      wsSendMessage({
        type: "chat",
        roomId: String(roomId),
        message: newMessage,
      });
      setNewMessage("");
    } else {
      // Fallback to HTTP if WebSocket not connected
      const success = await chatService.sendMessage(roomId, newMessage, token);
      if (success) {
        setNewMessage("");
        await fetchMessages();
      }
    }
    
    setSending(false);
  }, [newMessage, roomId, isConnected, wsSendMessage, fetchMessages]);

  // Fetch initial messages when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchMessages();
    }
  }, [roomId, fetchMessages]);

  return {
    messages,
    newMessage,
    setNewMessage,
    sending,
    sendMessage,
    isConnected,
  };
};
