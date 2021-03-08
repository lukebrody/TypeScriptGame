import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"

export class Player implements GameElement {
    position: Point
    maxSpeed: number
    radius: number
    gravity: number
    moveAcceleration: number
    speed = new Vector(0, 0);

    constructor(position: Point, maxSpeed: number, moveAcceleration: number, gravity: number, radius: number) {
        this.position = position;
        this.maxSpeed = maxSpeed;
        this.gravity = gravity;
        this.radius = radius;
        this.moveAcceleration = moveAcceleration;
    }

    update(frame: time, delta: time): void {
        let acceleration = new Vector(0, this.gravity);
        if(controls.keyPressed("a")) {
            acceleration.x -= this.moveAcceleration;
        }
        if(controls.keyPressed("d")) {
            acceleration.x += this.moveAcceleration;
        }
        if(controls.keyPressed("w")) {
            acceleration.y -= this.moveAcceleration;
        }
        if(controls.keyPressed("s")) {
            acceleration.y += this.moveAcceleration;
        }
        this.speed = new Vector(Math.min(this.maxSpeed, this.speed.x + acceleration.x * delta), Math.min(this.maxSpeed, this.speed.y + acceleration.y * delta));
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
        } else {
            this.position.x += move.size.x;
        }
    }
}