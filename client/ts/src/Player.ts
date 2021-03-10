import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"
import { NetworkMessage, PlayerPositionMessage, PlayerId } from "./NetworkMessage"
import { v4 as uuid } from 'uuid';

export class Player implements GameElement {
    position: Point
    maxSpeed: Vector
    radius: number
    gravity: number
    moveAcceleration: number
    speed = new Vector(0, 0);
    jumpAcceleration: number
    jumpKeypress = true;
    friction: number
    socket: WebSocket
    id: PlayerId

    constructor(
        position: Point, 
        maxSpeed: Vector, 
        moveAcceleration: number,
        gravity: number, 
        radius: number, 
        jumpAcceleration: number, 
        friction: number,
        socket: WebSocket
    ) {
        this.position = position;
        this.maxSpeed = maxSpeed;
        this.gravity = gravity;
        this.radius = radius;
        this.moveAcceleration = moveAcceleration;
        this.jumpAcceleration = jumpAcceleration;
        this.friction = friction;
        this.socket = socket;
        this.id = uuid();
    }

    update(frame: time, delta: time): void {
        let acceleration = new Vector(0, this.gravity);
        if(controls.keyPressed("a")) {
            acceleration.x -= this.moveAcceleration;
        }
        if(controls.keyPressed("d")) {
            acceleration.x += this.moveAcceleration;
        }
        if((controls.keyPressed("w") || controls.keyPressed(" ")) && Math.abs(this.speed.y) < 10 && this.jumpKeypress) {
            acceleration.y -= this.jumpAcceleration;
            this.jumpKeypress = false;
        }
        if(!(controls.keyPressed("w") || controls.keyPressed(" "))) {
            this.jumpKeypress = true;
        }
        this.speed = new Vector(
            Math.max(-this.maxSpeed.x, Math.min(this.maxSpeed.x, this.speed.x + acceleration.x * delta)),
            Math.max(-this.maxSpeed.y, Math.min(this.maxSpeed.y, this.speed.y + acceleration.y * delta))
        );
        this.position = this.position.add(this.speed.mul(delta));

        const positionMessage = new PlayerPositionMessage(this.id, this.position);

        if(this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(JSON.stringify(new class extends NetworkMessage {
                playerPosition = positionMessage
            }));
        }
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

    collide(moves: Rect[], delta: time): void {
        moves.forEach(move => {
            if (Math.abs(move.size.y) < Math.abs(move.size.x)) {
                this.position.y += move.size.y;
                this.speed.y *= -0.5;
                if(!(controls.keyPressed("a") || controls.keyPressed("d"))) {
                    if(this.speed.x > 0) {
                        this.speed.x = Math.max(0, this.speed.x - (this.friction * delta));
                    } else {
                        this.speed.x = Math.min(0, this.speed.x + (this.friction * delta));
                    }
                }
            } else {
                this.position.x += move.size.x;
                this.speed.x *= -0.5;
            }
        });
    }
}