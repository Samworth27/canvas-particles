import Vector2 from "./Vector2.js";

class Particle {
  static instances = [];

  constructor(
    container,
    id,
    position,
    velocity,
    size,
    mass,
    colour,
    context,
    lifespan = Infinity
  ) {
    this.container = container;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector2();
    this.size = size;
    this.colour = colour;
    this.context = context;
    this.id = id;
    this.lifespan = lifespan;
    this.age = 0;
    Particle.instances.push(this);
    this.instances = [];
    this.dragCoefficient = 5;
    this.area = (Math.PI * this.size * this.size) / 1000;
    this.airDensity = 1.1;
    this.mass = mass;
  }

  logIfZero(...args) {
    if (this.id === 0) {
      console.log(...args);
    }
  }

  executeIfZero(callback, ...args) {
    if (this.id === 0) {
      callback(...args);
    }
  }

  draw() {
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.size,
      0,
      Math.PI * 2,
      false
    );
    this.context.fillStyle = this.colour;
    this.context.fill();
  }

  applyGravity() {
    this.acceleration.y += .98;
  }

  applyFriction() {
    let x =
      -0.5 *
        this.dragCoefficient *
        this.area *
        this.airDensity *
        this.velocity.x *
        this.velocity.x *
        (this.velocity.x / Math.abs(this.velocity.x));
    let y =
      -0.5 *
      this.dragCoefficient *
      this.area *
      this.velocity.y *
      this.velocity.y *
      (this.velocity.y / Math.abs(this.velocity.y));
    // let friction = new Vector2(x, y);
    let friction = this.velocity.clone();
    friction.magnitude *= friction.magnitude;
    friction.magnitude *= -this.dragCoefficient * this.area * this.airDensity
    friction.magnitude /= 2 * this.mass
    this.acceleration.add(friction);
  }

  applyAcceleration(dt) {
    let acc = this.acceleration.clone();
    acc.scale(dt / 1000);
    this.velocity.add(acc);
  }
  applyVelocity(dt) {
    let vel = this.velocity.clone();
    vel.scale(dt / 10);

    this.position.add(vel);
  }

  move(dt) {
    this.applyGravity();
    this.applyFriction();
    this.applyAcceleration(dt);
    this.applyVelocity(dt);
  }

  getOlder(dt) {
    this.age += dt / 1000;
    if (this.age > this.lifespan) {
      this.draw = () => {};
      if (this.instances.length == 0) {
        this.container.splice(this.container.indexOf(this), 1);
      }
    }
  }

  // connect(particle) {
  //   this.context.strokeStyle = "rgba(140,140,31,1)";
  //   this.context.lineWidth = 1;
  //   this.context.beginPath();
  //   this.context.moveTo(this.position.x, this.position.y);
  //   this.context.lineTo(particle.position.x, particle.position.y);
  //   this.context.stroke();
  // }

  update(dt) {
    this.acceleration.reset();
    this.move(dt);
    this.draw();
  }
}

export default Particle;
