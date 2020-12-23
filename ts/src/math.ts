
export class Point {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vector): Point {
        return new Point(this.x + vec.x, this.y + vec.y);
    }
}
export class Vector {
    x: number 
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    mul(mul: number): Vector {
        return new Vector(this.x * mul, this.y * mul);
    }

    div(divisor: number): Vector {
        return new Vector(this.x / divisor, this.y / divisor);
    }

    normalized(): Vector {
        if(this.magnitude() === 0) {
            return new Vector(0, 0);
        } else {
            return this.div(this.magnitude());
        }
    }
}

export class Rect {
    origin: Point
    size: Vector

    constructor(origin: Point, size: Vector) {
        this.origin = origin;
        this.size = size;
    }
}