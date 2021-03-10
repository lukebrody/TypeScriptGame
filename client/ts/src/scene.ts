import { Rect } from "./math"
import { time, GameElement } from "./GameElement"

export class Scene implements GameElement {
    drawables: GameElement[]

    constructor(drawables: GameElement[]) {
        this.drawables = drawables;
    }

    savedCollisionRect?: Rect = undefined;

    update(frame: time, delta: time): void {
        this.drawables.forEach(drawable => { drawable.update(frame, delta); });
        
        this.drawables.forEach(target => {
            const targetRect = target.collisionDynamic();
            if(targetRect != undefined) {
                let collisionRects: Rect[] = []
                this.drawables.forEach(environment => {
                    const envRect = environment.collisionStatic(frame);
                    if(envRect != undefined) {
                        const collisionRect = targetRect.intersect(envRect);
                        if(collisionRect != undefined) {
                            this.savedCollisionRect = collisionRect;
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
                        }
                    }
                });
                target.collide(collisionRects, frame, delta);
            }
        });
    }

    draw(frame: time, context: CanvasRenderingContext2D): void {
        this.drawables.forEach(drawable => { 
            drawable.draw(frame, context); 
        });
        if(this.savedCollisionRect != undefined) {
            context.fillStyle = "#ff0000";
            context.fillRect(
                this.savedCollisionRect.origin.x, 
                this.savedCollisionRect.origin.y, 
                this.savedCollisionRect.size.x, 
                this.savedCollisionRect.size.y
            );
        }
    }

    collisionStatic(frame: time): Rect | undefined {
        return undefined;
    }

    collisionDynamic(): Rect | undefined {
        return undefined;
    }

    collide(move: Rect[], frame: time, delta: time): void {}
}
