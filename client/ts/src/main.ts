import { Scene } from "./Scene"
import { Point, Rect } from "./math"
import { Square } from "./Square"
import { Player } from "./Player"
import { Wall } from "./Wall"
import { Vector } from "./math"
import { NetworkMessage, PlayerId } from "./NetworkMessage" 
import { NetworkPlayer } from "./NetworkPlayer"

const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = event => {
    console.log("socket open");
};
 
const mainViewport = <HTMLCanvasElement> document.getElementById("mainViewport");
const context = <CanvasRenderingContext2D> mainViewport.getContext("2d");

const scene = new Scene([
    new Square(), 
    new Player(
        new Point(100, 100), /* Position */
        new Vector(300, 500), /* Max Speed */
        5000, /* Ground move acceleration */
        1000, /* Gravity */
        20, /* Circle Radius */
        20000, /* Jump acceleration */
        2500,
        socket /* Friction */
    ),
    new Wall(Rect.make(0, 0, 800, 20)),
    new Wall(Rect.make(0, 0, 20, 450)),
    new Wall(Rect.make(0, 450, 800, -20)),
    new Wall(Rect.make(800, 0, -20, 450)),
    new Wall(Rect.make(100, 400, 100, 10)),
    new Wall(Rect.make(250, 350, 100, 10)),
    new Wall(Rect.make(400, 300, 100, 10))
]);

const networkPlayers = new Map<PlayerId, NetworkPlayer>();

socket.onmessage = event => {
    // TODO: Validation. ts-auto-guard looks promising, but I can't figure out how to set it up (command doesn't execute)
    const message = JSON.parse(event.data) as NetworkMessage;
    message.playerPosition.map(playerPositionMessage => { 
        const player = networkPlayers.get(playerPositionMessage.id);
        if(player) {
            player.newPosition(playerPositionMessage.position);
        } else {
            const player = new NetworkPlayer(
                playerPositionMessage.id,
                playerPositionMessage.position,
                20,
                player => {
                    const index = scene.drawables.indexOf(player);
                    if(index != -1) {
                        scene.drawables.splice(index, 1);
                    }
                    networkPlayers.delete(player.id);
                }
            );
            networkPlayers.set(playerPositionMessage.id, player);
            scene.drawables.push(player);
        }
    });
}

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