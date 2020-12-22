export {};

const mainViewport = <HTMLCanvasElement> document.getElementById("mainViewport");
const context = <CanvasRenderingContext2D> mainViewport.getContext("2d");

let controls = {
    w: false,
    a: false,
    s: false,
    d: false
}

interface GameElement {
    update(timestamp: DOMHighResTimeStamp): void
    draw(timestamp: DOMHighResTimeStamp, context: CanvasRenderingContext2D): void
}

class Scene implements GameElement {
    drawables: GameElement[]

    constructor(drawables: GameElement[]) {
        this.drawables = drawables;
    }

    update(timestamp: DOMHighResTimeStamp): void {
        this.drawables.forEach(drawable => { drawable.update(timestamp); });
    }

    draw(timestamp: DOMHighResTimeStamp, context: CanvasRenderingContext2D): void {
        this.drawables.forEach(drawable => { drawable.draw(timestamp, context); });
    }
}

class Sphere implements GameElement {
    update(timestamp: DOMHighResTimeStamp): void {}
    draw(timestamp: DOMHighResTimeStamp, context: CanvasRenderingContext2D): void {
        const center = { x: 100, y: 100 + (50 * Math.sin(timestamp/ 1000)) };
        const size = 50;
        context.fillRect(center.x - (size / 2), center.y - (size / 2), size, size);
    }
}

let scene = new Scene([new Sphere()]);

function render(timestamp: DOMHighResTimeStamp): void {
    scene.update(timestamp);
    context.clearRect(0, 0, mainViewport.width, mainViewport.height);
    scene.draw(timestamp, context);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);