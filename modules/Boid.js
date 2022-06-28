import Particle from "./Particle.js";
import Vector2 from "./Vector2.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const sigmoid = (x) => 2 / (1 + Math.E ** -x);

class BoidsContainer {
  static maxSpeed = 1;
  static minSpeed = 5;
  static maxTurn = 0.001;
  static buffer = 10;
  static perception = 200;
  static crowding = 30;
  static separationFactor = 0.03;
  static cohesionFactor = 0.01;
  static alignmentFactor = 0.5;
  static avoidanceFactor = 1;

  constructor(canvas, context, options = {}) {
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

    super(container, id, position, velocity, size, 10, colour, context);

    this.forces = {
      cohesion: new Vector2(),
      alignment: new Vector2(),
      separation: new Vector2(),
    };
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

    // screen wrapping
    if (this.position.y > window.innerHeight) {
      this.position.y -= window.innerHeight;
    } else if (this.position.y < 0) {
      this.position.y += window.innerHeight;
    }
    if (this.position.x > window.innerWidth) {
      this.position.x -= window.innerWidth;
    } else if (this.position.x < 0) {
      this.position.x += window.innerWidth;
    }
  }

  getNeighbours() {
    this.neighbours = [];
    for (let i = 0; i < this.container.instances.length; i++) {
      if (this != this.container.instances[i]) {
        let diff = this.position.distanceTo(
          this.container.instances[i].position
        );

        if (diff < this.container.perception) {
          this.neighbours.push(this.container.instances[i]);
        }
      }
    }
  }

  getForces() {
    this.alignment();
    this.cohesion();
    this.separation();
  }

  alignment() {
    this.neighbours.forEach((neighbour) => {
      this.forces.alignment.add(neighbour.velocity);
    });
    this.forces.alignment.divide(this.neighbours.length);
  }

  cohesion() {
    let averagePosition = new Vector2();
    this.neighbours.forEach((neighbour) => {
      averagePosition.add(neighbour.position);
    });
    averagePosition.divide(this.neighbours.length);
    this.forces.cohesion = Vector2.subtract(averagePosition, this.position);
  }
  separation() {
    this.neighbours.forEach((neighbour) => {
      let diff = this.position.distanceTo(neighbour.position);
      if (diff < this.container.crowding) {
        let impulse = Vector2.subtract(this.position, neighbour.position);
        impulse.scale(0.5);
        this.forces.separation.add(impulse);
        impulse = impulse.clone();
        impulse.scale(-1);
        neighbour.forces.separation.add(impulse);
      }
    });
  }

  move(dt) {
    let forces = this.sumForces(this.forces)
    this.acceleration.add(forces);
    this.applyFriction();
    this.limitVelocityAngular();
    this.velocity.add(this.acceleration);
    this.limitVelocityLinear();
    this.position.add(this.velocity);
  }

  sumForces(forces) {
    let sum = new Vector2();
    // forces.cohesion.normalise();
    // forces.alignment.normalise();
    // forces.separation.normalise();
    forces.cohesion.scale(this.container.cohesionFactor);
    forces.alignment.scale(this.container.alignmentFactor);
    forces.separation.scale(this.container.separationFactor);
    sum.add(forces.cohesion);
    sum.add(forces.alignment);
    sum.add(forces.separation);
    return sum
  }

  limitVelocityAngular(dt) {
    let velocityDirection = this.velocity.direction;
    let accelerationDirection = this.acceleration.direction;
    let directionDelta =
      180 - ((180 - accelerationDirection + velocityDirection) % 360);
    if (Math.abs(directionDelta) > this.container.maxTurn) {
      if (directionDelta > 0) {
        accelerationDirection = velocityDirection + this.container.maxTurn;
      } else {
        this.acceleration.direction =
          velocityDirection - this.container.maxTurn;
      }
    }
  }

  limitVelocityLinear() {
    this.velocity.magnitude = clamp(this.velocity.magnitude, 0.1, 5);
  }

  draw() {
    super.draw();
    this.executeIfZero(() => {
      //draw perception
      this.context.beginPath();
      this.context.arc(
        this.position.x,
        this.position.y,
        this.container.perception,
        0,
        Math.PI * 2,
        false
      );
      this.context.strokeStyle = this.colour;
      this.context.stroke();
      // draw crowding
      this.context.beginPath();
      this.context.arc(
        this.position.x,
        this.position.y,
        this.container.crowding,
        0,
        Math.PI * 2,
        false
      );
      this.context.strokeStyle = this.colour;
      this.context.stroke();
    });
    this.context.moveTo(this.position.x, this.position.y);
    this.context.strokeStyle = "black";
    this.context.lineTo(
      this.position.x + this.velocity.x * (this.size / 2),
      this.position.y + this.velocity.y * (this.size / 2)
    );
    this.context.stroke();
  }

  connect(particle) {
    this.context.strokeStyle = "rgba(140,140,31,1)";
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(this.position.x, this.position.y);
    this.context.lineTo(particle.position.x, particle.position.y);
    this.context.stroke();
  }

  resetForces() {
    this.forces.separation.reset();
    this.forces.cohesion.reset();
    this.forces.alignment.reset();
  }

  update(dt) {
    //
    this.getNeighbours();
    this.getForces();
    this.avoidEdges();
    //
    this.move(dt);
    this.draw();
    this.acceleration.reset();
    this.resetForces();
  }
}

export default BoidsContainer;
