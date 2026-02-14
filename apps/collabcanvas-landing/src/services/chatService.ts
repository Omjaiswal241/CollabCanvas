import { HTTP_BACKEND } from "@/lib/config";
import type { Message } from "@/types/room";

export const chatService = {
  async fetchMessages(roomId: number): Promise<Message[]> {
    try {
      const response = await fetch(`${HTTP_BACKEND}/chats/${roomId}`);
      const data = await response.json();
      
      if (data.messages) {
        return data.messages.reverse();
      }
      return [];
    } catch (err) {
      console.error("Error fetching messages:", err);
      return [];
    }
  },

  async sendMessage(roomId: number, message: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${HTTP_BACKEND}/chats/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      return response.ok;
    } catch (err) {
      console.error("Error sending message:", err);
      return false;
    }
  },
};
