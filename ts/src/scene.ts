import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"

type time = number;

interface GameElement {
    update(frame: time, delta: time): void
    draw(fame: time, context: CanvasRenderingContext2D): void

    collisionStatic(frame: time): Option<Rect>
    collisionDynamic(): Option<Rect>

    collide(move: Vector): void
}

export class Scene implements GameElement {
    drawables: GameElement[]

    constructor(drawables: GameElement[]) {
        this.drawables = drawables;
    }

    update(frame: time, delta: time): void {
        this.drawables.forEach(drawable => { drawable.update(frame, delta); });
        
        this.drawables.forEach(target => {
            target.collisionDynamic().map(targetRect => {
                this.drawables.forEach(environment => {
                    environment.collisionStatic(frame).map(envRect => {
                        targetRect.intersect(envRect).map(collisionRect => { 
                            console.log(collisionRect);
                        });
                    });
                });
            });
        });
    }

    draw(frame: time, context: CanvasRenderingContext2D): void {
        this.drawables.forEach(drawable => { drawable.draw(frame, context); });
    }

    collisionStatic(frame: time): Option<Rect> {
        return Option.none()
    }

    collisionDynamic(): Option<Rect> {
        return Option.none()
    }

    collide(move: Vector): void {}
}

export class Square implements GameElement {
    update(frame: time, delta: time): void {}

    private rect(frame: time): Rect {
        const center = new Point(100, 100 + (50 * Math.sin(frame)));
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

    collide(move: Vector): void {}
}

export class Player implements GameElement {
    position: Point
    speed: number
    radius: number

    constructor(position: Point, speed: number, radius: number) {
        this.position = position;
        this.speed = speed;
        this.radius = radius;
    }

    update(frame: time, delta: time): void {
        let vector = new Vector(0, 0);
        if(controls.keyPressed("a")) {
            vector.x -= 1;
        }
        if(controls.keyPressed("d")) {
            vector.x += 1;
        }
        if(controls.keyPressed("w")) {
            vector.y -= 1;
        }
        if(controls.keyPressed("s")) {
            vector.y += 1;
        }
        this.position = this.position.add(vector.normalized().mul(this.speed * delta));
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
        const size = new Vector(this.radius, this.radius)
        return Option.some(new Rect(this.position.sub(size.div(2)), size))
    }

    collide(move: Vector): void {}
}