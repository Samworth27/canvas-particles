import Particle from "./Particle.js";

class PhysicsParticle extends Particle {
  constructor(descriptor, ...args) {
    super(descriptor, ...args);
    this.mass = descriptor.mass;
    this.dragCoefficient = descriptor.dragCoefficient;
    this.airDensity = descriptor.airDensity;
    this.gravity = descriptor.gravity;
    this.area = (Math.PI * this.size * this.size) / 1000;
  }

  build(descriptor, ...args) {
    super.build(descriptor, ...args);
    this.mass = descriptor.mass;
    this.dragCoefficient = descriptor.dragCoefficient;
    this.airDensity = descriptor.airDensity;
    this.gravity = descriptor.gravity;
    this.area = (Math.PI * this.size * this.size) / 1000;
  }

  applyGravity() {
    this.acceleration.y += this.gravity;
  }

  applyFriction() {
    let friction = this.velocity.clone();
    friction.magnitude *= friction.magnitude;
    friction.magnitude *= -this.dragCoefficient * this.area * this.airDensity;
    friction.magnitude /= 2 * this.mass;
    this.acceleration.add(friction);
  }

  applyForces() {
    this.applyFriction();
    this.applyGravity();
  }
  update(){
    this.getOlder();
    this.applyForces();
    this.move();
    this.draw();
    this.reset();
  }
}

export default PhysicsParticle
export {PhysicsParticle}