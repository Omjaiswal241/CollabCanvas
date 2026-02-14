import { HTTP_BACKEND } from "@/lib/config";
import type { Shape } from "@/types/room";

export const canvasService = {
  async fetchCanvasData(roomId: number, token: string): Promise<Shape[]> {
    try {
      const response = await fetch(`${HTTP_BACKEND}/canvas/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.canvasData && data.canvasData.length > 0) {
        return data.canvasData
          .filter((item: any) => item.type === 'shape')
          .map((item: any) => {
            const shape = JSON.parse(item.data);
            return { ...shape, dbId: item.id };
          });
      }
      return [];
    } catch (err) {
      console.error("Error fetching canvas data:", err);
      return [];
    }
  },

  async saveShape(roomId: number, shape: Shape, token: string): Promise<number | null> {
    try {
      const response = await fetch(`${HTTP_BACKEND}/canvas/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "shape",
          data: shape,
        }),
      });
      const data = await response.json();
      
      if (data.canvasData) {
        return data.canvasData.id;
      }
      return null;
    } catch (err) {
      console.error("Error saving canvas data:", err);
      return null;
    }
  },

  async deleteShape(roomId: number, dbId: number, token: string): Promise<boolean> {
    try {
      await fetch(`${HTTP_BACKEND}/canvas/${roomId}/${dbId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (err) {
      console.error("Error deleting canvas item:", err);
      return false;
    }
  },

  async clearCanvas(roomId: number, token: string): Promise<boolean> {
    try {
      await fetch(`${HTTP_BACKEND}/canvas/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (err) {
      console.error("Error clearing canvas:", err);
      return false;
    }
  },
};
