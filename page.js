"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainViewport = document.getElementById("mainViewport");
const context = mainViewport.getContext("2d");
let controls = {
    w: false,
    a: false,
    s: false,
    d: false
};
class Scene {
    constructor(drawables) {
        this.drawables = drawables;
    }
    update(timestamp) {
        this.drawables.forEach(drawable => { drawable.update(timestamp); });
    }
    draw(timestamp, context) {
        this.drawables.forEach(drawable => { drawable.draw(timestamp, context); });
    }
}
class Sphere {
    update(timestamp) { }
    draw(timestamp, context) {
        const center = { x: 100, y: 100 + (50 * Math.sin(timestamp / 1000)) };
        const size = 50;
        context.fillRect(center.x - (size / 2), center.y - (size / 2), size, size);
    }
}
let scene = new Scene([new Sphere()]);
function render(timestamp) {
    scene.update(timestamp);
    context.clearRect(0, 0, mainViewport.width, mainViewport.height);
    scene.draw(timestamp, context);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
