function polarToCartesian(r, theta) {
  return [r * Math.cos(toRadians(theta)), r * Math.sin(toRadians(theta))];
}

const toRadians = (degree) => degree * (Math.PI / 180);
const toDegrees = (radians) => radians * (180 / Math.PI);
const setPrecision = (number, precision) => +number.toFixed(precision);

class Vector {}

window.Vector = Vector;

class Vector2 extends Vector {
  static canOperateOn(object) {
    return typeof object.x == "number" && typeof object.y == "number";
  }

  static subtract(vector1, vector2) {
    if (this.canOperateOn(vector1) && this.canOperateOn(vector2)) {
      return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
    } else {
      throw new Error("Can not operate on one or either of these objects");
    }
  }

  static add(vector1, vector2) {
    if (this.canOperateOn(vector1) && this.canOperateOn(vector2)) {
      return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
    } else {
      throw new Error("Can not operate on one or either of these objects");
    }
  }

  static divide(vector1, number) {
    if (this.canOperateOn(vector1) && typeof number === "number") {
      return new Vector2(vector1.x / number, vector1.y / number);
    } else {
      throw new Error("Can not operate on one or either of these objects");
    }
  }

  static scale(vector1, number) {
    if (this.canOperateOn(vector1) && typeof number === "number") {
      return new Vector2(vector1.x * number, vector1.y * number);
    } else {
      throw new Error("Can not operate on one or either of these objects");
    }
  }

  static distanceBetween(vector1, vector2) {
    if (this.canOperateOn(vector1) && this.canOperateOn(vector2)) {
      return Math.hypot(vector2.x - vector1.x, vector2.y - vector1.y);
    } else {
      throw new Error("Can not calculate the distance between these objects");
    }
  }

  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }

  get direction() {
    return (toDegrees(Math.atan2(this.y, this.x)) + 360) % 360;
  }

  set direction(value) {
    if (this.magnitude === 0) {
      throw new Error("Cannot set the direction of a vector with no magnitude");
      // [this.x, this.y] = polarToCartesian(1, value);
      // this.magnitude = 0.000001;
    } else {
      [this.x, this.y] = polarToCartesian(this.magnitude, value);
    }
  }

  get magnitude() {
    return Math.hypot(this.x, this.y);
  }

  set magnitude(value) {
    [this.x, this.y] = polarToCartesian(value, this.direction);
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }

  add(vector) {
    if (Vector2.canOperateOn(vector)) {
      this.x += vector.x;
      this.y += vector.y;
    } else {
      throw new Error("Cannot add this object to a vector");
    }
  }

  subtract(vector) {
    if (Vector2.canOperateOn(vector)) {
      this.x -= vector.x;
      this.y -= vector.y;
    } else {
      throw new Error("Cannot subtract this object from a vector");
    }
  }

  divide(number) {
    if (typeof number === "number") {
      this.x /= number;
      this.y /= number;
    }
  }

  normalise() {
    let magnitude = this.magnitude;
    this.x = this.x/ magnitude;
    this.y = this.y/ magnitude;
  }

  // scale magnitude without sin or cos
  scale(number) {
    if (typeof number === "number") {
      this.x *= number;
      this.y *= number;
    } else {
      throw new Error("Cannot scale this vector");
    }
  }

  // scale magnitude without sin or cos
  scaleTo(number){
    if(typeof number === "number"){
      let magnitude = this.magnitude;
      this.x = this.x * number / magnitude;
    }
  }

  distanceTo(vector) {
    if (Vector2.canOperateOn(vector)) {
      return Math.hypot(vector.x - this.x, vector.y - this.y);
    } else {
      throw new Error("Cannot calculate distance to this vector");
    }
  }

  toUnitVector() {
    if (this.magnitude > 1) {
      this.x /= this.magnitude;
      this.y /= this.magnitude;
    }
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
}

// Vector2.prototype.toString = () => "Vector2";

export default Vector2;
