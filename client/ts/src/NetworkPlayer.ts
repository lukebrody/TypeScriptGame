import { Point, Rect, Vector } from "./math"
import { time, GameElement } from "./GameElement"
import { PlayerId } from "./NetworkMessage"

export class NetworkPlayer implements GameElement {
    position: Point
    radius: number
    id: PlayerId
    lastUpdate: time
    removeSelf: (p: NetworkPlayer) => void

    constructor(
        id: PlayerId,
        position: Point, 
        radius: number,
        removeSelf: (p: NetworkPlayer) => void
    ) {
        this.id = id;
        this.position = new Point(position.x, position.y); // see comment for newPosition
        this.radius = radius;
        this.lastUpdate = performance.now();
        this.removeSelf = removeSelf;
    }

    newPosition(pos: Point) {
        // Set these individually since the passed object isn't a typescript object
        // (I know, this is terrible)
        this.position.x = pos.x;
        this.position.y = pos.y;

        this.lastUpdate = performance.now();
    }

    update(frame: time, delta: time): void {
        if (frame - (this.lastUpdate / 1000) > 3) {
            this.removeSelf(this);
        }
    }

    draw(frame: time, ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    collisionStatic(frame: time): Rect | undefined {
        const size = new Vector(this.radius * 2, this.radius * 2);
        return new Rect(this.position.sub(size.div(2)), size);
    }

    collisionDynamic(): Rect | undefined {
        return undefined;
    }

    collide(move: Rect[], frame: time, delta: time): void {}
}