const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const sigmoid = (x) => 4 / (1 + Math.E ** -x);

class Particle {
  static maxSpeed = 5;
  static maxTurn = 5;
  static buffer = 100;
  static instances = [];
  static perception = 50;
  static crowding = 20;
  static separationFactor = 1 / 5;
  static cohesionFactor = 1 / 100;
  static alignmentFactor = 0.5;

  constructor(position, velocity, size, colour, context) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector2();
    this.size = size;
    this.colour = colour;
    this.ctx = context;
    this.id = Particle.instances.length;
    Particle.instances.push(this);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(
      this.position.x,
      this.position.y,
      this.size,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fillStyle = this.id == 0 ? "#FFFFFF" : this.colour;
    this.ctx.fill();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.strokeStyle = "black"
    this.ctx.lineTo(
      this.position.x + this.velocity.x * (this.size / 2),
      this.position.y + this.velocity.y * (this.size / 2)
    );
    this.ctx.stroke();
  }

  avoidEdges() {
    if (
      [
        Particle.buffer - this.position.y,
        Particle.buffer - this.position.x,
        this.position.y + Particle.buffer - window.innerHeight,
        this.position.x + Particle.buffer - window.innerWidth,
      ].reduce((a, b) => Math.max(a, b), -Infinity) > 0
    ) {
      this.acceleration.add(
        Vector2.subtract(Particle.screenCenter, this.position)
      );
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
          // this.connect(Particle.instances[i])
        }
      }
    }
  }

  alignment() {
    let force = new Vector2();
    this.neighbours.forEach((neighbour) => force.add(neighbour.velocity));
    force.divide(this.neighbours.length);
    force.subtract(this.velocity);
    force.toUnitVector();
    force.scalarMultiply(Particle.alignmentFactor);
    this.acceleration.add(force);
  }

  cohesion() {
    let force = new Vector2();
    this.neighbours.forEach((neighbour) => force.add(neighbour.position));
    force.divide(this.neighbours.length);
    force.subtract(this.position);
    force.toUnitVector();
    force.scalarMultiply(Particle.cohesionFactor);

    this.acceleration.add(force);
  }
  separation() {
    let force = new Vector2();
    this.neighbours.forEach((neighbour) => {
      if (this.position.distanceTo(neighbour.position) < Particle.crowding) {
        force.subtract(Vector2.subtract(this.position, neighbour.position));
        this.connect(neighbour)
      }
    });
    force.toUnitVector();
    force.scalarMultiply(Particle.separationFactor);
    this.acceleration.subtract(force);
  }

  move() {
    this.limitVelocityAngular();
    this.velocity.add(this.acceleration);
    this.limitVelocityLinear();
  }

  limitVelocityAngular() {
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
  limitVelocityLinear() {
    this.velocity.magnitude = sigmoid(this.velocity.magnitude);
  }

  connect(particle) {
    this.ctx.strokeStyle = "rgba(140,140,31,1)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(particle.position.x, particle.position.y);
    this.ctx.stroke();
  }

  update() {
    this.acceleration.reset();
    this.acceleration.direction = this.velocity.direction;
    this.colour = "#8C5523";

    this.getNeighbours();
    if (this.neighbours.length > 0) {
      this.alignment();
      this.cohesion();
      this.separation();
    }
    this.avoidEdges();
    this.move();

    this.position.add(this.velocity);
    this.draw();
  }
}

export default Particle;
