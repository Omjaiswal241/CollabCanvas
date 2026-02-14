import "dotenv/config";
import { WebSocketServer,WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client";

const PORT = parseInt(process.env.PORT || '8080', 10);
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server is running on port ${PORT}`);

interface User{
    ws:WebSocket,
    rooms:string[],
    userId:string
}
const users:User[]=[];

function checkUser(token:string):string | null
{
    try
    {
    const decoded=jwt.verify(token,JWT_SECRET);

    if(typeof decoded=="string")
    {
        return null;
    }
    if(!decoded || !(decoded as JwtPayload).userId)
    {
        return null;
    }
    return decoded.userId;
    }
    catch(e)
    {
        return  null;
    }
    return null; 
}
wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')||"";
    const userId=checkUser(token);

    if(userId==null)
    {
        ws.close();
        return null ;
    }
    users.push({
        userId,
        rooms:[],
        ws
    })

    ws.on('message',async function message(data) {
        let parsedData;
        if(typeof data!=="string")
        {
            parsedData=JSON.parse(data.toString());
        }
        else
        {
            parsedData=JSON.parse(data);
        }
    if(parsedData.type==="join_room")
    {
        const user=users.find(x=>x.ws===ws);
        user?.rooms.push(parsedData.roomId);
    }
    if(parsedData.type==="leave_room")
        {
            const user=users.find(x=>x.ws===ws);
            if(!user)
            {
                return;
            }
            user.rooms=user?.rooms.filter(x=>x===parsedData.room);
        }
    if(parsedData.type=="chat")
    {
        const roomId=parsedData.roomId;
        const message=parsedData.message;

        const chat = await prismaClient.chat.create({
            data:{
                roomId:Number(roomId),
                message,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        
        users.forEach(user=>{
            if(user.rooms.includes(roomId))
            {
                user.ws.send(JSON.stringify({
                    type:"chat",
                    message: chat.message,
                    roomId,
                    userId: chat.userId,
                    userName: chat.user.name,
                    chatId: chat.id,
                    createdAt: chat.createdAt
                }))
            }
        })
    }
    
    if(parsedData.type=="draw" || parsedData.type=="erase" || parsedData.type=="clear")
    {
        const roomId=parsedData.roomId;
        const drawData=parsedData.data;

        // Save canvas data to database
        await prismaClient.canvasData.create({
            data:{
                roomId:Number(roomId),
                userId,
                type: parsedData.type,
                data: JSON.stringify(drawData)
            }
        });
        
        // Broadcast to all users in the room
        users.forEach(user=>{
            if(user.rooms.includes(roomId) && user.userId !== userId)
            {
                user.ws.send(JSON.stringify({
                    type: parsedData.type,
                    data: drawData,
                    roomId,
                    userId
                }))
            }
        })
    }
    });
});