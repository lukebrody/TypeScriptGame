
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

    sub(vec: Vector): Point {
        return new Point(this.x - vec.x, this.y - vec.y);
    }

    subPt(point: Point): Vector {
        return new Vector(this.x - point.x, this.y - point.y);
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

    abs(): Vector {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }

    dot(vec: Vector): number {
        return this.x * vec.x + this.y * vec.y;
    }

    projectOnto(vec: Vector): Vector {
        if(vec.magnitude() === 0) {
            return new Vector(0, 0);
        } else {
            return vec.mul(this.dot(vec) / (vec.magnitude() * vec.magnitude()));
        }
    }

    static zero = new Vector(0, 0);
}

export class Rect {
    origin: Point
    size: Vector

    constructor(origin: Point, size: Vector) {
        this.origin = origin;
        this.size = size;
    }

    static make(x: number, y: number, w: number, h: number) {
        return new Rect(new Point(x, y), new Vector(w, h));
    }

    normalized(): Rect {
        return new Rect(
            new Point(
                Math.min(this.origin.x, this.origin.x + this.size.x), 
                Math.min(this.origin.y, this.origin.y + this.size.y)
            ),
            this.size.abs()
        );
    }

    min(): Point {
        return this.normalized().origin;
    }

    max(): Point {
        return this.normalized().origin.add(this.normalized().size);
    }

    xRange(): Range {
        return new Range(this.min().x, this.max().x);
    }

    yRange(): Range {
        return new Range(this.min().y, this.max().y);
    }

    intersect(other: Rect): Rect | undefined {
        const xIntersect = this.xRange().intersect(other.xRange());
        const yIntersect = this.yRange().intersect(other.yRange());
        if(xIntersect != undefined && yIntersect != undefined) {
            return new Rect(new Point(xIntersect.min, yIntersect.min), new Vector(xIntersect.length(), yIntersect.length())); 
        } else {
            return undefined;
        }
    }

    center(): Point {
        return this.origin.add(this.size.div(2));
    }
}

export class Range {
    min: number
    max: number

    constructor(min: number, max: number) {
        console.assert(min <= max);
        this.min = min;
        this.max = max;
    }

    contains(value: number): boolean {
        return value >= this.min && value <= this.max;
    }

    intersect(other: Range): Range | undefined {
        const newMin = Math.max(this.min, other.min);
        const newMax = Math.min(this.max, other.max);
        if(newMin <= newMax) {
            return new Range(newMin, newMax);
        } else {
            return undefined;
        }
    }

    length(): number {
        return this.max - this.min;
    }
}