import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages
    .map((x: { message: any }) => {
      let messageData;

      if (typeof x.message === "string") {
        try {
          messageData = JSON.parse(x.message);
        } catch {
          return null;
        }
      } else {
        messageData = x.message;
      }

      return messageData?.shape ?? null;
    })
    .filter(Boolean);

  return shapes;

}