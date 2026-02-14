export interface Message {
  id: number;
  message: string;
  userId: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export interface RoomData {
  id: number;
  slug: string;
  adminId: string;
}

export type DrawingTool = "pencil" | "eraser" | "rectangle" | "circle" | "line" | "triangle" | "text";

export type ShapeType = "rectangle" | "circle" | "line" | "triangle" | "freehand" | "text";

export interface Shape {
  type: ShapeType;
  points: number[];
  id: number;
  dbId?: number;
  text?: string;
}
