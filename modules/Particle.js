import Vector2 from './Vector2.js';

class Particle {
  static instances = [];

  constructor(
    container,
    id,
    position,
    velocity,
    size,
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
  }

  logIfZero(value) {
    if (this.id === 0) {
      console.log(value);
    }
  }

  executeIfZero(callback,...args){
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

  applyGravity(dt, factor = 0) {
    this.acceleration.y += factor * dt * 0.001;
  }
  applyFriction(dt, factor = 0) {
    this.velocity.divide(1 + (factor * dt) / 1000);
  }
  applyAcceleration(dt) {
    this.velocity.add(this.acceleration);
  }
  applyVelocity(dt) {
    this.position.add(this.velocity);
  }

  move(dt) {
    this.applyGravity(dt);
    this.applyFriction(dt);
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
