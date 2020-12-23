export { Point2D, Vector2D }

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