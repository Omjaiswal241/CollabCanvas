import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req:Request,res:Response,next:NextFunction)
{
    try {
        const authHeader = req.headers["authorization"] ?? "";
        
        // Extract token from "Bearer <token>" format or use as-is
        const token = authHeader.startsWith("Bearer ") 
            ? authHeader.substring(7) 
            : authHeader;
        
        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        
        if (decoded && decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Unauthorized",
            error: error instanceof Error ? error.message : "Invalid token"
        });
    }
}