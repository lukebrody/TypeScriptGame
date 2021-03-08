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
    new Player(
        new Point(100, 100), /* Position */
        new Vector(300, 500), /* Max Speed */
        10000, /* Ground move acceleration */
        1000, /* Gravity */
        20, /* Circle Radius */
        20000, /* Jump acceleration */
        5000 /* Friction */
    ),
    new Wall(Rect.make(0, 0, 800, 20)),
    new Wall(Rect.make(0, 0, 20, 450)),
    new Wall(Rect.make(0, 450, 800, -20)),
    new Wall(Rect.make(800, 0, -20, 450)),
    new Wall(Rect.make(100, 400, 100, 10)),
    new Wall(Rect.make(250, 350, 100, 10)),
    new Wall(Rect.make(400, 300, 100, 10))
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