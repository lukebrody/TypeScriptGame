import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"

export class Wall implements GameElement {
    rect: Rect

    constructor(rect: Rect) {
        this.rect = rect;
    }

    update(frame: time, delta: time): void {}

    draw(frame: time, context: CanvasRenderingContext2D): void {
        const r = this.rect;
        context.fillStyle = "#000000";
        context.fillRect(r.origin.x, r.origin.y, r.size.x, r.size.y);
    }

    collisionStatic(frame: time): Option<Rect> {
        return Option.some(this.rect)
    }

    collisionDynamic(): Option<Rect> {
        return Option.none()
    }

    collide(move: Rect, delta: time): void {}
}