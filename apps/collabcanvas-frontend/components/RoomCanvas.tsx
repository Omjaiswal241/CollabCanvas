"use client";

import { initDraw } from "@/app/draw";
import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import{Canvas} from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string})
{
    const [socket,setSocket]=useState<WebSocket | null>(null);
    useEffect(()=>
    {
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmODcyZGNkZS1hMWIxLTRjYjAtOTY2NS04NmE0ZDc0YzBmYjEiLCJpYXQiOjE3NzA3NTU4NzN9.F8B7BeczijIA6RYcpcSsriBiWm9Zzgw49ZImoqvLFQ4`)
        ws.onopen=()=>
        {
            setSocket(ws);
            const data=JSON.stringify({
                type:"join_room",
                roomId
            })
            ws.send(data);
        }
    },[])
    if(!socket)
    {
        return <div>
            Connecting to server....
        </div>
    }
    return <div>
        <Canvas roomId={roomId} socket={socket}/>
        </div>
}