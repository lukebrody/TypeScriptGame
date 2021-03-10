import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"

export type time = number;

export interface GameElement {
    update(frame: time, delta: time): void
    draw(fame: time, context: CanvasRenderingContext2D): void

    collisionStatic(frame: time): Option<Rect>
    collisionDynamic(): Option<Rect>

    collide(collisionRect: Rect, delta: time): void
}