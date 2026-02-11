import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[];
} | {
    type: "text";
    x: number;
    y: number;
    content: string;
    fontSize: number;
}


export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle"
    private currentPencilPoints: { x: number; y: number }[] = [];
    private hoveredShapeIndex: number = -1;
    socket: WebSocket


    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        console.log("Game instance created");
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    destroy() {
        console.log("Game instance destroyed");
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }
    setTool(tool: "circle" | "pencil" | "rect" | "eraser" | "text") {
        console.log("Setting tool to:", tool);
        this.selectedTool = tool;
        this.hoveredShapeIndex = -1; // Reset hover state when changing tools
        this.clearCanvas(); // Redraw to remove highlights
        // Change cursor based on tool
        if (tool === "eraser") {
            this.canvas.style.cursor = "pointer";
        } else if (tool === "text") {
            this.canvas.style.cursor = "text";
        } else {
            this.canvas.style.cursor = "crosshair";
        }
    }
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("WebSocket message received:", message);
            if (message.type == "chat") {
                const parsed = JSON.parse(message.message)
                console.log("Adding shape from WebSocket:", parsed.shape);
                this.existingShapes.push(parsed.shape)
                this.clearCanvas();
            } else if (message.type == "delete") {
                const parsed = JSON.parse(message.message);
                console.log("Deleting shape at index:", parsed.index);
                if (parsed.index >= 0 && parsed.index < this.existingShapes.length) {
                    this.existingShapes.splice(parsed.index, 1);
                    this.clearCanvas();
                }
            }
        }
    }

    findShapeAtPoint(x: number, y: number, verbose: boolean = false): number {
        if (verbose) {
            console.log(`Finding shape at point (${x}, ${y})`);
            console.log(`Total shapes:`, this.existingShapes.length);
        }

        // Search from end to start (top shape first)
        for (let i = this.existingShapes.length - 1; i >= 0; i--) {
            const shape = this.existingShapes[i];
            if (verbose) console.log(`Checking shape ${i}:`, shape.type);

            if (shape.type === "rect") {
                // Normalize rectangle bounds to handle negative widths/heights
                const minX = Math.min(shape.x, shape.x + shape.width);
                const maxX = Math.max(shape.x, shape.x + shape.width);
                const minY = Math.min(shape.y, shape.y + shape.height);
                const maxY = Math.max(shape.y, shape.y + shape.height);

                if (verbose) console.log(`Rect bounds: x(${minX}-${maxX}), y(${minY}-${maxY})`);

                // Check if point is inside rectangle
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                    if (verbose) console.log(`Hit! Shape ${i} (rect)`);
                    return i;
                }
            } else if (shape.type === "circle") {
                // Check if point is inside circle
                const dx = x - shape.centerX;
                const dy = y - shape.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (verbose) console.log(`Circle at (${shape.centerX}, ${shape.centerY}), radius ${shape.radius}, distance ${distance}`);

                if (distance <= Math.abs(shape.radius)) {
                    if (verbose) console.log(`Hit! Shape ${i} (circle)`);
                    return i;
                }
            } else if (shape.type === "pencil") {
                // Check if point is near any line segment
                const threshold = 12; // pixels - balanced for precision
                for (let j = 0; j < shape.points.length - 1; j++) {
                    const p1 = shape.points[j];
                    const p2 = shape.points[j + 1];
                    const dist = this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
                    if (dist <= threshold) {
                        if (verbose) console.log(`Hit! Shape ${i} (pencil)`);
                        return i;
                    }
                }
            } else if (shape.type === "text") {
                // Approximate text bounds
                this.ctx.font = `${shape.fontSize}px Arial`;
                const textMetrics = this.ctx.measureText(shape.content);
                const textWidth = textMetrics.width;
                const textHeight = shape.fontSize;

                // Check if point is inside text bounds
                if (x >= shape.x && x <= shape.x + textWidth &&
                    y >= shape.y && y <= shape.y + textHeight) {
                    if (verbose) console.log(`Hit! Shape ${i} (text)`);
                    return i;
                }
            }
        }
        if (verbose) console.log("No shape found at this point");
        return -1; // No shape found
    }

    pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.map((shape, index) => {
            if (shape.type === "rect") {
                // Highlight if hovered with eraser
                if (this.selectedTool === "eraser" && index === this.hoveredShapeIndex) {
                    this.ctx.strokeStyle = "rgba(255,100,100,1)";
                    this.ctx.lineWidth = 3;
                } else {
                    this.ctx.strokeStyle = "rgba(255,255,255)";
                    this.ctx.lineWidth = 1;
                }
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            else if (shape.type === "circle") {
                // Highlight if hovered with eraser
                if (this.selectedTool === "eraser" && index === this.hoveredShapeIndex) {
                    this.ctx.strokeStyle = "rgba(255,100,100,1)";
                    this.ctx.lineWidth = 3;
                } else {
                    this.ctx.strokeStyle = "rgba(255,255,255)";
                    this.ctx.lineWidth = 1;
                }
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if (shape.type === "pencil") {
                if (shape.points.length > 1) {
                    // Highlight if hovered with eraser
                    if (this.selectedTool === "eraser" && index === this.hoveredShapeIndex) {
                        this.ctx.strokeStyle = "rgba(255,100,100,1)";
                        this.ctx.lineWidth = 4;
                    } else {
                        this.ctx.strokeStyle = "rgba(255,255,255)";
                        this.ctx.lineWidth = 2;
                    }
                    this.ctx.lineCap = "round";
                    this.ctx.lineJoin = "round";
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
            else if (shape.type === "text") {
                // Highlight if hovered with eraser
                if (this.selectedTool === "eraser" && index === this.hoveredShapeIndex) {
                    this.ctx.fillStyle = "rgba(255,100,100,1)";
                } else {
                    this.ctx.fillStyle = "rgba(255,255,255)";
                }
                this.ctx.font = `${shape.fontSize}px Arial`;
                this.ctx.textBaseline = "top";
                this.ctx.fillText(shape.content, shape.x, shape.y);
                console.log("Rendering text:", shape.content, "at", shape.x, shape.y);
            }
        })
    }
    mouseDownHandler = (e: MouseEvent) => {
        console.log("Mouse down - selected tool:", this.selectedTool);
        this.clicked = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        if (this.selectedTool === "pencil") {
            this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
        }
    }
    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        console.log("Mouse up - selected tool:", this.selectedTool);

        // Handle eraser tool
        if (this.selectedTool === "eraser") {
            console.log("Eraser mode active, checking for shape at click point");
            const shapeIndex = this.findShapeAtPoint(currentX, currentY, true);
            if (shapeIndex !== -1) {
                console.log("Erasing shape at index:", shapeIndex);
                this.existingShapes.splice(shapeIndex, 1);
                this.clearCanvas();

                // Notify other clients
                this.socket.send(JSON.stringify({
                    type: "delete",
                    message: JSON.stringify({ index: shapeIndex }),
                    roomId: this.roomId
                }));
            } else {
                console.log("No shape found to erase at this location");
            }
            return;
        }

        // Handle text tool
        if (this.selectedTool === "text") {
            console.log("Text tool active - showing prompt");
            const text = prompt("Enter text:");
            console.log("User entered:", text);
            if (text && text.trim()) {
                const shape: Shape = {
                    type: "text",
                    x: currentX,
                    y: currentY,
                    content: text.trim(),
                    fontSize: 24
                };

                console.log("Creating text shape:", shape);
                this.existingShapes.push(shape);
                this.clearCanvas();

                this.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId: this.roomId
                }));
            }
            return;
        }

        const width = currentX - this.startX;
        const height = currentY - this.startY;

        let shape: Shape | null = null;

        if (this.selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            };
            console.log("Creating rectangle");
        }
        else if (this.selectedTool === "circle") {
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

            shape = {
                type: "circle",
                radius,
                centerX: this.startX + width / 2,
                centerY: this.startY + height / 2
            };
            console.log("Creating circle");
        }
        else if (this.selectedTool === "pencil") {
            // Add final point if not already added
            if (this.currentPencilPoints.length > 0) {
                const lastPoint = this.currentPencilPoints[this.currentPencilPoints.length - 1];
                if (lastPoint.x !== currentX || lastPoint.y !== currentY) {
                    this.currentPencilPoints.push({ x: currentX, y: currentY });
                }
            }

            if (this.currentPencilPoints.length > 1) {
                shape = {
                    type: "pencil",
                    points: [...this.currentPencilPoints]
                };
                console.log("Creating pencil stroke");
            }
            this.currentPencilPoints = [];
        }

        if (!shape) return;

        this.existingShapes.push(shape);
        this.clearCanvas();

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId
        }));
    }
    mouseMoveHandler = (e: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Update hover state for eraser
        if (this.selectedTool === "eraser" && !this.clicked) {
            const newHoveredIndex = this.findShapeAtPoint(currentX, currentY, false);
            if (newHoveredIndex !== this.hoveredShapeIndex) {
                this.hoveredShapeIndex = newHoveredIndex;
                this.clearCanvas();
            }
            return;
        }

        if (this.clicked) {
            // Don't draw anything when eraser or text tool is selected
            if (this.selectedTool === "eraser" || this.selectedTool === "text") {
                return;
            }

            const width = currentX - this.startX;
            const height = currentY - this.startY;

            if (this.selectedTool === "pencil") {
                this.currentPencilPoints.push({ x: currentX, y: currentY });
                this.clearCanvas();

                // Draw current pencil stroke
                if (this.currentPencilPoints.length > 1) {
                    this.ctx.strokeStyle = "rgba(255,255,255)";
                    this.ctx.lineWidth = 2;
                    this.ctx.lineCap = "round";
                    this.ctx.lineJoin = "round";
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
                    for (let i = 1; i < this.currentPencilPoints.length; i++) {
                        this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            } else {
                this.clearCanvas();
                this.ctx.strokeStyle = "rgba(255,255,255)"

                if (this.selectedTool === "rect") {
                    this.ctx.strokeRect(this.startX, this.startY, width, height);
                }
                else if (this.selectedTool === "circle") {
                    const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
                    const centerX = this.startX + width / 2;
                    const centerY = this.startY + height / 2;
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        }
    }
    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }


}