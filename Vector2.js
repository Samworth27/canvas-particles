/**
 *
 * @param {x: number, y: number} vector - 2d vector in cartesian form
 * @returns {{r: number, theta: number}} 2d vector in polar form
 */

function cartesianToPolar(x, y) {
  return {
    r: Math.sqrt(x ** 2 + y ** 2),
    theta: Math.atan2(y, x) * (180 / Math.PI),
  };
}

/**
 *
 * @param {r: number, theta: number} vector - 2d vector in polar form
 * @returns {{x:number, y: number}} - 2d vector in cartesian form
 */
function polarToCartesian(r, theta) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  };
}

class Vector2 {
  #_x;
  #_y;
  #_r;
  #_theta;
  constructor({ x, y, r, theta } = {}) {
    if (x != null && y != null && !(r != null && theta != null)) {
      this.#_x = x;
      this.#_y = y;
      this._calcPolar();
    } else if (r != null && theta != null && !(x != null && y != null)) {
      this.#_r = r;
      this.#_theta = theta;
      this._calcCartesian();
    }
  }

  /**
   * @param {number} v
   */
  set x(v) {
    this.#_x = v;
    this._calcPolar();
  }

  /**
   * @param {number} v
   */
  set y(v) {
    this.#_y = v;
    this._calcPolar();
  }

  /**
   * @param {number} v
   */
  set r(v) {
    this.#_r = v;
    this._calcCartesian();
  }

  /**
   * @param {number} v
   */
  set theta(v) {
    this.#_theta = v;
    this._calcCartesian();
  }

  _calcPolar() {
    this.#_r = +Math.hypot(this.#_x, this.#_y).toFixed(5);
    this.#_theta = +(Math.atan2(this.#_y, this.#_x) * (180 / Math.PI)).toFixed(
      5
    );
  }

  _calcCartesian() {
    this.#_x = +(this.#_r * Math.cos(this.#_theta / (180 / Math.PI))).toFixed(
      5
    );
    this.#_y = +(this.#_r * Math.sin(this.#_theta / (180 / Math.PI))).toFixed(
      5
    );
  }

  vectorTo(target) {
    return new Vector2({ x: target.x - this.x, y: target.y - this.y });
  }

  get x() {
    return this.#_x;
  }
  get y() {
    return this.#_y;
  }
  get r() {
    return this.#_r;
  }
  get theta() {
    return this.#_theta;
  }
}

export { Vector2, cartesianToPolar, polarToCartesian };
