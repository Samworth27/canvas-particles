import Particle from "./Particle.js";
import Vector2 from "./Vector2.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const sigmoid = (x) => 2 / (1 + Math.E ** -x);

class BoidsContainer {
  static maxSpeed = 5;
  static minSpeed = 1;
  static maxTurn = 5;
  static buffer = 10;
  static perception = 50;
  static crowding = 20;
  static separationFactor = 10;
  static cohesionFactor = 5;
  static alignmentFactor = 10;
  static avoidanceFactor = 100;

  constructor(canvas, context, options = {}) {
    // options
    this.maxSpeed = options.maxSpeed || BoidsContainer.maxSpeed;
    this.minSpeed = options.minSpeed || BoidsContainer.minSpeed;
    this.maxTurn = options.maxTurn || BoidsContainer.maxTurn;
    this.buffer = options.buffer || BoidsContainer.buffer;
    this.perception = options.perception || BoidsContainer.perception;
    this.crowding = options.crowding || BoidsContainer.crowding;
    this.separationFactor =
      options.separationFactor || BoidsContainer.separationFactor;
    this.cohesionFactor =
      options.cohesionFactor || BoidsContainer.cohesionFactor;
    this.alignmentFactor =
      options.alignmentFactor || BoidsContainer.alignmentFactor;
    this.avoidanceFactor =
      options.avoidanceFactor || BoidsContainer.avoidanceFactor;

    this.screenCenter = new Vector2(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    this.context = context;
    this.instances = [];
    this.boidsCount = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < this.boidsCount; i++) {
      this.instances.push(
        new Boid(this, this.instances.length, 5, "#FFFFFF", this.context)
      );
    }
  }

  update(dt) {
    this.instances.forEach((instance) => instance.update(dt));
  }
}

class Boid extends Particle {
  constructor(container, id, size, colour, context) {
    let position = new Vector2(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );
    let velocity = new Vector2(0, 0);
    velocity.magnitude = 1;
    velocity.direction = Math.random() * 360;

    super(container, id, position, velocity, size, colour, context);
    this.steering = new Vector2();
  }

  draw() {
    super.draw();
    this.context.moveTo(this.position.x, this.position.y);
    this.context.strokeStyle = "black";
    this.context.lineTo(
      this.position.x + this.velocity.x * (this.size / 2),
      this.position.y + this.velocity.y * (this.size / 2)
    );
    this.context.stroke();
  }

  avoidEdges() {
    // if (
    //   [
    //     Particle.buffer - this.position.y,
    //     Particle.buffer - this.position.x,
    //     this.position.y + Particle.buffer - window.innerHeight,
    //     this.position.x + Particle.buffer - window.innerWidth,
    //   ].reduce((a, b) => Math.max(a, b), -Infinity) > 0
    // ) {
    //   let force = Vector2.subtract(Particle.screenCenter, this.position);
    //   force.toUnitVector();
    //   force.scale(Particle.avoidanceFactor);
    //   this.steering.add(force);
    // }
    if(this.position.y > window.innerHeight){
      this.steering.y = -10;
    }else if(this.position.y < 0){
      this.steering.y = 10;
    }
  }

  getNeighbours() {
    this.neighbours = [];
    for (let i = 0; i < Particle.instances.length; i++) {
      if (this != Particle.instances[i]) {
        if (
          this.position.distanceTo(Particle.instances[i].position) <
          Particle.perception
        ) {
          this.neighbours.push(Particle.instances[i]);
        }
      }
    }
  }

  alignment() {}

  cohesion() {}
  separation() {}

  move(dt) {
    this.acceleration = Vector2.scale(this.steering, dt);
    this.limitVelocityAngular(dt);
    this.velocity.add(Vector2.scale(this.acceleration, dt));
    this.limitVelocityLinear(dt);
    this.position.add(this.velocity);
  }

  limitVelocityAngular(dt) {
    let directionOld = this.velocity.direction;
    let directionDelta =
      180 -
      ((180 - this.acceleration.direction + this.velocity.direction) % 360);
    if (Math.abs(directionDelta) > Particle.maxTurn) {
      if (directionDelta > 0) {
        this.acceleration.direction = directionOld + Particle.maxTurn;
      } else {
        this.acceleration.direction = directionOld - Particle.maxTurn;
      }
    }
  }

  limitVelocityLinear() {}

  connect(particle) {
    this.context.strokeStyle = "rgba(140,140,31,1)";
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(this.position.x, this.position.y);
    this.context.lineTo(particle.position.x, particle.position.y);
    this.context.stroke();
  }

  update(dt) {
    this.acceleration.reset();
    this.steering.reset();
    this.avoidEdges();
    this.move(dt);
    this.draw();
  }
}

export default BoidsContainer;
