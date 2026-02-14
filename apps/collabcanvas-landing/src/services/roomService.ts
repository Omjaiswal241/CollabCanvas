import { HTTP_BACKEND } from "@/lib/config";
import type { RoomData } from "@/types/room";

export const roomService = {
  async fetchRoom(slug: string): Promise<RoomData | null> {
    try {
      const response = await fetch(`${HTTP_BACKEND}/room/${slug}`);
      const data = await response.json();
      return data.room || null;
    } catch (err) {
      console.error("Error fetching room:", err);
      return null;
    }
  },
};
