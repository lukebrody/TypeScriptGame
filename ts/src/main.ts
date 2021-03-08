import { Scene } from "./Scene"
import { Point, Rect } from "./math"
import { Square } from "./Square"
import { Player } from "./Player"
import { Wall } from "./Wall";
import { Vector } from "./math";
 
const mainViewport = <HTMLCanvasElement> document.getElementById("mainViewport");
const context = <CanvasRenderingContext2D> mainViewport.getContext("2d");

let scene = new Scene([
    new Square(), 
    new Player(new Point(100, 100), new Vector(300, 500), 2000, 500, 20, 20000),
    new Wall(Rect.make(0, 0, 800, 20)),
    new Wall(Rect.make(0, 0, 20, 450)),
    new Wall(Rect.make(0, 450, 800, -20)),
    new Wall(Rect.make(800, 0, -20, 450))
]);

let lastTimestamp: DOMHighResTimeStamp = performance.now();

function render(timestamp: DOMHighResTimeStamp): void {
    let frame = timestamp / 1000;
    let lastFrame = lastTimestamp / 1000;
    scene.update(frame, frame - lastFrame);
    context.clearRect(0, 0, mainViewport.width, mainViewport.height);
    scene.draw(frame, context);
    lastTimestamp = timestamp;
    requestAnimationFrame(render);
}

requestAnimationFrame(render);