import { controls } from "./controls"
import { Point, Rect, Vector } from "./math"
import { None, Option } from "prelude-ts"
import { time, GameElement } from "./GameElement"

export class Scene implements GameElement {
    drawables: GameElement[]

    constructor(drawables: GameElement[]) {
        this.drawables = drawables;
    }

    savedCollisionRect: Option<Rect> = Option.none();

    update(frame: time, delta: time): void {
        this.drawables.forEach(drawable => { drawable.update(frame, delta); });
        
        this.drawables.forEach(target => {
            target.collisionDynamic().map(targetRect => {
                let collisionRects: Rect[] = []
                this.drawables.forEach(environment => {
                    environment.collisionStatic(frame).map(envRect => {
                        targetRect.intersect(envRect).map(collisionRect => { 
                            this.savedCollisionRect = Option.some(collisionRect);
                            let centersVector = targetRect.center().subPt(envRect.center());
                            if (centersVector.x < 0) {
                                collisionRect.origin.x += collisionRect.size.x;
                                collisionRect.size.x *= -1;
                            }
                            if (centersVector.y < 0) {
                                collisionRect.origin.y += collisionRect.size.y;
                                collisionRect.size.y *= -1;
                            }
                            collisionRects.push(collisionRect);
                        });
                    });
                });
                target.collide(collisionRects, frame, delta);
            });
        });
    }

    draw(frame: time, context: CanvasRenderingContext2D): void {
        this.drawables.forEach(drawable => { 
            drawable.draw(frame, context); 
            // drawable.collisionStatic(frame).map(staticCollisionRect => {
            //     context.fillStyle = "#00ff00";
            //     context.fillRect(staticCollisionRect.origin.x, staticCollisionRect.origin.y, staticCollisionRect.size.x, staticCollisionRect.size.y);
            // });
            // drawable.collisionDynamic().map(dynamicCollisionRect => {
            //     context.fillStyle = "#00ff00";
            //     context.fillRect(dynamicCollisionRect.origin.x, dynamicCollisionRect.origin.y, dynamicCollisionRect.size.x, dynamicCollisionRect.size.y);
            // });
        });
        this.savedCollisionRect.map(collisionRect => {
            context.fillStyle = "#ff0000";
            context.fillRect(collisionRect.origin.x, collisionRect.origin.y, collisionRect.size.x, collisionRect.size.y);
        });
    }

    collisionStatic(frame: time): Option<Rect> {
        return Option.none()
    }

    collisionDynamic(): Option<Rect> {
        return Option.none()
    }

    collide(move: Rect[], delta: time): void {}
}
