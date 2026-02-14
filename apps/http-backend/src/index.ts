import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common";
import { prismaClient, PrismaClient } from "@repo/db/client";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}))

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.json({
            message: "Incorrect inputs"
        })
    }
    try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    }
    catch (e) {
        console.error("Full Signup error:");
        console.error(e);
        if (e && typeof e === 'object') {
            console.error("Error details:", JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
        }

        // Check if it's a unique constraint violation (P2002)
        if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
            return res.status(411).json({
                message: "User already exists with this username"
            });
        }
        // For other errors, return a generic error
        res.status(500).json({
            message: "Error creating user",
            error: String(e),
            details: e && typeof e === 'object' ? JSON.stringify(e, Object.getOwnPropertyNames(e), 2) : undefined
        })
    }
})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.json({
            message: "Incorrect inputs"
        })
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username
        }
    })
    
    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }
    
    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);
    if (!passwordMatch) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }
    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);
    res.json({
        token
    })
})

app.post("/room", middleware,async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.json({
            message: "Incorrect inputs"
        })
    }
    // @ts-ignore
    const userId=req.userId;
    try{
        const room=await prismaClient.room.create({
        data:{
            slug:parsedData.data.name,
            adminId:userId
        }
    })
    res.json({
        roomId: room.id
    })
    }
    catch(e)
    {
        res.status(411).json({
            message:"Room already exists with this name"
        })
    }
})

app.get("/chats/:roomId",async(req,res)=>
{
    try{
        const roomId=Number(req.params.roomId);
    const messages=await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:"desc"
        },
        take:50,
        include:{
            user:{
                select:{
                    id:true,
                    name:true
                }
            }
        }
    });
    res.json({
        messages
    })
    }
    catch(e)
    {
        console.error("Error fetching messages:", e);
        res.status(500).json({message:"Error fetching messages"});
    }
    
})

// Post a new chat message
app.post("/chats/:roomId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        // @ts-ignore
        const userId = req.userId;
        const { message } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }
        
        const newMessage = await prismaClient.chat.create({
            data: {
                roomId: roomId,
                userId: userId,
                message: message
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
        
        res.json({ message: newMessage });
    } catch(e) {
        console.error("Error saving message:", e);
        res.status(500).json({ message: "Error saving message" });
    }
})

// Delete all chats for a room
app.delete("/chats/:roomId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        // @ts-ignore
        const userId = req.userId;
        
        // Check if user is the room admin
        const room = await prismaClient.room.findFirst({
            where: {
                id: roomId,
                adminId: userId
            }
        });
        
        if (!room) {
            return res.status(403).json({ 
                message: "Not authorized to clear chats in this room" 
            });
        }
        
        // Delete all chats for this room
        await prismaClient.chat.deleteMany({
            where: {
                roomId: roomId
            }
        });
        
        res.json({ 
            message: "All chats cleared successfully" 
        });
    } catch (e) {
        console.error("Error clearing chats:", e);
        res.status(500).json({ 
            message: "Error clearing chats" 
        });
    }
})

app.get("/room/:slug",async(req,res)=>
{
    const slug=req.params.slug;
    const room=await prismaClient.room.findFirst({
        where:{
            slug
        }
    });
    res.json({
        room
    })
})

// Get user profile
app.get("/user/me", middleware, async(req, res) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                photo: true,
                createdAt: true
            }
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ user });
    } catch (e) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Get user's rooms
app.get("/user/rooms", middleware, async(req, res) => {
    try {
        // @ts-ignore
        const userId = req.userId;
        const rooms = await prismaClient.room.findMany({
            where: {
                adminId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                slug: true,
                createdAt: true
            }
        });
        
        res.json({ rooms });
    } catch (e) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
});

// Delete a room
app.delete("/room/:roomId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        // @ts-ignore
        const userId = req.userId;
        
        // Check if user is the room admin
        const room = await prismaClient.room.findFirst({
            where: {
                id: roomId,
                adminId: userId
            }
        });
        
        if (!room) {
            return res.status(403).json({ 
                message: "Not authorized to delete this room" 
            });
        }
        
        // Delete all related data first (canvas data and chats)
        await prismaClient.canvasData.deleteMany({
            where: { roomId: roomId }
        });
        
        await prismaClient.chat.deleteMany({
            where: { roomId: roomId }
        });
        
        // Finally delete the room
        await prismaClient.room.delete({
            where: { id: roomId }
        });
        
        res.json({ 
            message: "Room deleted successfully" 
        });
    } catch (e) {
        console.error("Error deleting room:", e);
        res.status(500).json({ 
            message: "Error deleting room" 
        });
    }
});

// Get canvas data for a room
app.get("/canvas/:roomId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const canvasData = await prismaClient.canvasData.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                createdAt: 'asc'
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
        
        res.json({ canvasData });
    } catch (e) {
        res.status(500).json({ message: "Error fetching canvas data" });
    }
});

// Save canvas data for a room
app.post("/canvas/:roomId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        // @ts-ignore
        const userId = req.userId;
        const { type, data } = req.body;
        
        if (!type || !data) {
            return res.status(400).json({ message: "Type and data are required" });
        }
        
        const canvasData = await prismaClient.canvasData.create({
            data: {
                roomId: roomId,
                userId: userId,
                type: type,
                data: JSON.stringify(data)
            }
        });
        
        res.json({ canvasData });
    } catch (e) {
        console.error("Error saving canvas data:", e);
        res.status(500).json({ message: "Error saving canvas data" });
    }
});

// Delete a specific canvas item
app.delete("/canvas/:roomId/:canvasId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const canvasId = Number(req.params.canvasId);
        // @ts-ignore
        const userId = req.userId;
        
        // Check if the canvas item exists and belongs to this room
        const canvasItem = await prismaClient.canvasData.findFirst({
            where: {
                id: canvasId,
                roomId: roomId
            }
        });
        
        if (!canvasItem) {
            return res.status(404).json({ 
                message: "Canvas item not found" 
            });
        }
        
        // Delete the specific canvas item
        await prismaClient.canvasData.delete({
            where: {
                id: canvasId
            }
        });
        
        res.json({ 
            message: "Canvas item deleted successfully" 
        });
    } catch (e) {
        console.error("Error deleting canvas item:", e);
        res.status(500).json({ 
            message: "Error deleting canvas item" 
        });
    }
});

// Clear all canvas data for a room
app.delete("/canvas/:roomId", middleware, async(req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        // @ts-ignore
        const userId = req.userId;
        
        // Check if user is the room admin
        const room = await prismaClient.room.findFirst({
            where: {
                id: roomId,
                adminId: userId
            }
        });
        
        if (!room) {
            return res.status(403).json({ 
                message: "Not authorized to clear canvas in this room" 
            });
        }
        
        // Delete all canvas data for this room
        await prismaClient.canvasData.deleteMany({
            where: {
                roomId: roomId
            }
        });
        
        res.json({ 
            message: "Canvas cleared successfully" 
        });
    } catch (e) {
        console.error("Error clearing canvas:", e);
        res.status(500).json({ 
            message: "Error clearing canvas" 
        });
    }
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'http-backend'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`HTTP Backend server is running on port ${PORT}`);
});