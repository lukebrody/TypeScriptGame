import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"

export class Player implements GameElement {
    position: Point
    maxSpeed: Vector
    radius: number
    gravity: number
    moveAcceleration: number
    speed = new Vector(0, 0);
    jumpAcceleration: number
    canJump = true;

    constructor(position: Point, maxSpeed: Vector, moveAcceleration: number, gravity: number, radius: number, jumpAcceleration: number) {
        this.position = position;
        this.maxSpeed = maxSpeed;
        this.gravity = gravity;
        this.radius = radius;
        this.moveAcceleration = moveAcceleration;
        this.jumpAcceleration = jumpAcceleration;
    }

    update(frame: time, delta: time): void {
        let acceleration = new Vector(0, this.gravity);
        if(controls.keyPressed("a")) {
            acceleration.x -= this.moveAcceleration;
        }
        if(controls.keyPressed("d")) {
            acceleration.x += this.moveAcceleration;
        }
        if((controls.keyPressed("w") || controls.keyPressed(" ")) && this.canJump) {
            acceleration.y -= this.jumpAcceleration;
            this.canJump = false;
        }
        this.speed = new Vector(
            Math.max(-this.maxSpeed.x, Math.min(this.maxSpeed.x, this.speed.x + acceleration.x * delta)),
            Math.max(-this.maxSpeed.y, Math.min(this.maxSpeed.y, this.speed.y + acceleration.y * delta))
        );
        this.position = this.position.add(this.speed.mul(delta));
    }

    draw(frame: time, ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    collisionStatic(frame: time): Option<Rect> {
        return Option.none()
    }

    collisionDynamic(): Option<Rect> {
        const size = new Vector(this.radius * 2, this.radius * 2);
        return Option.some(new Rect(this.position.sub(size.div(2)), size));
    }

    collide(move: Rect): void {
        if (Math.abs(move.size.y) < Math.abs(move.size.x)) {
            this.position.y += move.size.y;
            this.speed.y = 0;
        } else {
            this.position.x += move.size.x;
            this.speed.x = 0;
        }
        this.canJump = true;
    }
}