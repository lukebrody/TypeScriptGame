import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"
import { NetworkMessage, PlayerPositionMessage, PlayerId } from "./NetworkMessage"
import { v4 as uuid } from 'uuid';

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

    collisionStatic(frame: time): Option<Rect> {
        const size = new Vector(this.radius * 2, this.radius * 2);
        return Option.some(new Rect(this.position.sub(size.div(2)), size));
    }

    collisionDynamic(): Option<Rect> {
        return Option.none();
    }

    collide(move: Rect[], delta: time): void {}
}