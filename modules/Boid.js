import Particle from "./Particle.js";
import Vector2 from "./Vector2.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const sigmoid = (x) => 2 / (1 + Math.E ** -x);

class BoidsContainer {
  static maxSpeed = 1;
  static minSpeed = 5;
  static maxTurn = 0.5;
  static buffer = 10;
  static perception = 200;
  static crowding = 20;
  static separationFactor = 10;
  static cohesionFactor = 1;
  static alignmentFactor = 1;
  static avoidanceFactor = 1;

  constructor(canvas, context, options = {}) {
    console.log(options.perception || BoidsContainer.perception);
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

    this.forces = {
      cohesion: new Vector2(),
      alignment: new Vector2(),
      separation: new Vector2(),
      reset: function () {
        this.cohesion.reset();
        this.alignment.reset();
        this.separation.reset();
      },
      sumOfAll: function () {
        let sum = new Vector2();
        sum.add(this.cohesion);
        sum.add(this.alignment);
        sum.add(this.separation);
        return sum;
      },
    };
  }

  draw() {
    super.draw();
    this.executeIfZero(() => {
      this.context.beginPath();
      this.context.arc(
        this.position.x,
        this.position.y,
        this.size * 10,
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

  alignment() {
    this.neighbours.forEach((neighbour) => {
      this.forces.alignment.add(neighbour.velocity);
      this.forces.alignment.divide(this.neighbours.length);
    });
  }

  cohesion() {}
  separation() {}

  move(dt) {
    this.acceleration.add(this.forces.sumOfAll());
    this.limitVelocityLinear(dt);
    this.limitVelocityAngular(dt);
    this.velocity.add(this.acceleration);
    this.applyFriction(dt);
    this.position.add(this.velocity);
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

  connect(particle) {
    this.context.strokeStyle = "rgba(140,140,31,1)";
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(this.position.x, this.position.y);
    this.context.lineTo(particle.position.x, particle.position.y);
    this.context.stroke();
  }

  applyFriction(dt){
    super.applyFrictionNew(dt,1);
  }

  update(dt) {
    this.acceleration.reset();
    this.forces.reset();
    //
    this.getNeighbours();
    this.alignment();
    this.avoidEdges();
    //
    this.move(dt);
    this.draw();
  }
}

export default BoidsContainer;
