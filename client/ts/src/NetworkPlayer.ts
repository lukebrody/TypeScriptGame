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
        this.position = position;
        this.radius = radius;
        this.lastUpdate = performance.now();
        this.removeSelf = removeSelf;
    }

    newPosition(pos: Point) {
        this.position = pos;
        this.lastUpdate = performance.now();
    }

    update(frame: time, delta: time): void {
        if (frame - this.lastUpdate > 5) {
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
        return Option.none();
    }

    collisionDynamic(): Option<Rect> {
        return Option.none();
    }

    collide(move: Rect, delta: time): void {}
}