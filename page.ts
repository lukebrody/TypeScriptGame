export {};

const mainViewport = <HTMLCanvasElement> document.getElementById("mainViewport");
const context = <CanvasRenderingContext2D> mainViewport.getContext("2d");

let controls = {
    keys: new Map<KeyboardEvent["key"], boolean>(),

    keyPressed(key: KeyboardEvent["key"]): boolean {
        return this.keys.get(key) ?? false;
    }
}

window.addEventListener("keydown", event => {
    controls.keys.set(event.key, true);
});

window.addEventListener("keyup", event => {
    controls.keys.set(event.key, false);
});

type time = number;

interface GameElement {
    update(frame: time, delta: time): void
    draw(fame: time, context: CanvasRenderingContext2D): void
}

class Scene implements GameElement {
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

class Sphere implements GameElement {
    update(frame: time, delta: time): void {}
    draw(frame: time, context: CanvasRenderingContext2D): void {
        const center = { x: 100, y: 100 + (50 * Math.sin(frame)) };
        const size = 50;
        context.fillStyle = "#000000";
        context.fillRect(center.x - (size / 2), center.y - (size / 2), size, size);
    }
}

class Point2D {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vector2D): Point2D {
        return new Point2D(this.x + vec.x, this.y + vec.y);
    }
}
class Vector2D {
    x: number 
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    mul(mul: number): Vector2D {
        return new Vector2D(this.x * mul, this.y * mul);
    }

    div(divisor: number): Vector2D {
        return new Vector2D(this.x / divisor, this.y / divisor);
    }

    normalized(): Vector2D {
        if(this.magnitude() === 0) {
            return new Vector2D(0, 0);
        } else {
            return this.div(this.magnitude());
        }
    }
}

class Player implements GameElement {
    position: Point2D
    speed: number
    radius: number

    constructor(position: Point2D, speed: number, radius: number) {
        this.position = position;
        this.speed = speed;
        this.radius = radius;
    }

    update(frame: time, delta: time): void {
        let vector = new Vector2D(0, 0);
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

let scene = new Scene([new Sphere(), new Player(new Point2D(100, 100), 200, 20)]);

let lastTimestamp: DOMHighResTimeStamp = performance.now();

function render(timestamp: DOMHighResTimeStamp): void {
    let frame = timestamp / 1000;
    let lastFrame = lastTimestamp / 1000;
    scene.update(frame, frame - lastFrame);
    context.clearRect(0, 0, mainViewport.width, mainViewport.height);
    scene.draw(frame, context);
    lastTimestamp = timestamp;
    requestAnimationFrame(render);
}

requestAnimationFrame(render);