import { controls } from "./controls"
import { Point, Vector } from "./math"

type time = number;

interface GameElement {
    update(frame: time, delta: time): void
    draw(fame: time, context: CanvasRenderingContext2D): void
}

export class Scene implements GameElement {
    drawables: GameElement[]

    constructor(drawables: GameElement[]) {
        this.drawables = drawables;
    }

    update(frame: time, delta: time): void {
        this.drawables.forEach(drawable => { drawable.update(frame, delta); });
    }

    draw(frame: time, context: CanvasRenderingContext2D): void {
        this.drawables.forEach(drawable => { drawable.draw(frame, context); });
    }
}

export class Square implements GameElement {
    update(frame: time, delta: time): void {}
    draw(frame: time, context: CanvasRenderingContext2D): void {
        const center = { x: 100, y: 100 + (50 * Math.sin(frame)) };
        const size = 50;
        context.fillStyle = "#000000";
        context.fillRect(center.x - (size / 2), center.y - (size / 2), size, size);
    }
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
}