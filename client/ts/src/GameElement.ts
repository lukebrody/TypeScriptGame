import { Rect } from "./math"

export type time = number;

export interface GameElement {
    update(frame: time, delta: time): void
    draw(fame: time, context: CanvasRenderingContext2D): void

    collisionStatic(frame: time): Rect | undefined
    collisionDynamic(): Rect | undefined

    collide(collisionRects: Rect[], frame: time, delta: time): void
}