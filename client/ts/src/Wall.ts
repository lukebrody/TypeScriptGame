import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
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

    collisionStatic(frame: time): Rect | undefined {
        return this.rect;
    }

    collisionDynamic(): Rect | undefined {
        return undefined;
    }

    collide(move: Rect[], frame: time, delta: time): void {}
}