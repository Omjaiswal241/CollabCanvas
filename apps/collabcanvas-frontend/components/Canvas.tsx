import { initDraw } from "@/app/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Pencil, RectangleHorizontalIcon, Eraser, Type } from "lucide-react";
import { IconButton } from "./IconButton";
import { Game } from "@/app/draw/Game";


export type Tool = "circle" | "rect" | "pencil" | "eraser" | "text";

export function Canvas({
    roomId, socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(()=>{
        if (gameRef.current) {
            gameRef.current.setTool(selectedTool); 
        }
    },[selectedTool]);

    useEffect(() => {
        if (canvasRef.current && !gameRef.current) {
            gameRef.current = new Game(canvasRef.current, roomId, socket);
            gameRef.current.setTool(selectedTool);
        }
        
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy();
                gameRef.current = null;
            }
        }
    }, []);
    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({ selectedTool, setSelectedTool }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10
    }}>
        <div className="flex gap-t">

            <IconButton onClick={() => {
                setSelectedTool("pencil")
            }}
                activated={selectedTool === "pencil"} icon={<Pencil />}></IconButton>

            <IconButton onClick={() => {
                setSelectedTool("rect")
            }}
                activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />}></IconButton>

            <IconButton onClick={() => {
                setSelectedTool("circle")
            }}
                activated={selectedTool === "circle"} icon={<Circle />}></IconButton>

            <IconButton onClick={() => {
                setSelectedTool("eraser")
            }}
                activated={selectedTool === "eraser"} icon={<Eraser />}></IconButton>

            <IconButton onClick={() => {
                setSelectedTool("text")
            }}
                activated={selectedTool === "text"} icon={<Type />}></IconButton>
        </div>
    </div> 
}