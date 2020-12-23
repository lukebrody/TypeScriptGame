import { Scene, Sphere, Player} from "./scene"
import { Point } from "./math"

const mainViewport = <HTMLCanvasElement> document.getElementById("mainViewport");
const context = <CanvasRenderingContext2D> mainViewport.getContext("2d");

let scene = new Scene([new Sphere(), new Player(new Point(100, 100), 200, 20)]);

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