const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const sigmoid = (x) => 2 / (1 + Math.E ** -x);
// let numberOfParticles = (canvas.height * canvas.width) / 9000;
class Particle {
  static maxSpeed = 5;
  static minSpeed = 1;
  static maxTurn = 5;
  static buffer = 10;
  static instances = [];
  static perception = 50;
  static crowding = 20;
  static separationFactor = 10;
  static cohesionFactor = 5;
  static alignmentFactor = 10;
  static avoidanceFactor = 100;

  constructor(position, velocity, size, colour, context) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector2();
    this.steering = new Vector2();
    this.size = size;
    this.colour = colour;
    this.ctx = context;
    this.id = Particle.instances.length;
    Particle.instances.push(this);
  }

  logIfZero(value) {
    if (this.id === 0) {
      console.log(value);
    }
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
    this.ctx.strokeStyle = "black";
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
      let force = Vector2.subtract(Particle.screenCenter, this.position);
      force.toUnitVector();
      force.scalarMultiply(Particle.avoidanceFactor)
      this.steering.add(force);
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
    this.steering.add(force);
  }

  cohesion() {
    let force = new Vector2();
    this.neighbours.forEach((neighbour) => force.add(neighbour.position));
    force.divide(this.neighbours.length);
    force.subtract(this.position);
    force.toUnitVector();
    force.scalarMultiply(Particle.cohesionFactor);

    this.steering.add(force);
  }
  separation() {
    let force = new Vector2();
    this.neighbours.forEach((neighbour) => {
      if (
        this.position.distanceTo(neighbour.position) <
        Particle.crowding + this.size
      ) {
        force.subtract(Vector2.subtract(this.position, neighbour.position));
        this.connect(neighbour);
      }
    });
    force.toUnitVector();
    force.scalarMultiply(Particle.separationFactor);
    this.steering.subtract(force);
  }

  move(dt) {
    this.acceleration = Vector2.scalarMultiply(this.steering, dt);
    this.limitVelocityAngular(dt);
    this.velocity.add(Vector2.scalarMultiply(this.acceleration, dt));
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

  limitVelocityLinear() {
    // this.logIfZero(this.velocity.magnitude);
    this.velocity.magnitude = sigmoid(this.velocity.magnitude);

    // this.velocity.magnitude = clamp(this.velocity.magnitude, 5, 6)

    // if (this.velocity.magnitude < Particle.minSpeed) {
    //   this.velocity.toUnitVector();
    //   this.velocity.scalarMultiply(5);
    // }
    // if (this.velocity.magnitude > Particle.maxSpeed) {
    //   this.velocity = Vector2.divide(this.velocity, this.velocity.magnitude);
    //   this.velocity.scalarMultiply(Particle.maxSpeed);
    // }
  }

  connect(particle) {
    this.ctx.strokeStyle = "rgba(140,140,31,1)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(particle.position.x, particle.position.y);
    this.ctx.stroke();
  }

  update(dt) {
    this.acceleration.reset();
    this.steering.reset();
    this.colour = "#8C5523";

    this.getNeighbours();

    if (this.neighbours.length > 0) {
      this.alignment();
      this.cohesion();
      this.separation();
    }

    this.avoidEdges();
    this.move(dt);

    this.draw();
  }
}

export default Particle;
