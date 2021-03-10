import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"

export class Square implements GameElement {
    update(frame: time, delta: time): void {}

    private rect(frame: time): Rect {
        const center = new Point(600, 300 + (50 * Math.sin(frame)));
        const size = new Vector(50, 50);
        return new Rect(
            center.sub(size.div(2)),
            size
        )
    }

    draw(frame: time, context: CanvasRenderingContext2D): void {
        const r = this.rect(frame);
        context.fillStyle = "#000000";
        context.fillRect(r.origin.x, r.origin.y, r.size.x, r.size.y);
    }

    collisionStatic(frame: time): Option<Rect> {
        return Option.some(this.rect(frame))
    }

    collisionDynamic(): Option<Rect> {
        return Option.none()
    }

    collide(move: Rect[], delta: time): void {}
}