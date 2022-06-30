class ParticleDescriptor {
  constructor(size, colour, shape, lifespan, movement = "normal") {
    this.size = size;
    this.colour = colour;
    this.shape = shape;
    this.lifespan = lifespan;
    this.movement = movement;
  }
}

class PhysicsParticleDescriptor {
  constructor(mass, dragCoefficient, gravity, airDensity, particleDescriptor){
    this.size = particleDescriptor.size;
    this.colour = particleDescriptor.colour;
    this.shape = particleDescriptor.shape;
    this.lifespan = particleDescriptor.lifespan;
    this.movement = particleDescriptor.movement;
    this.mass = mass;
    this.dragCoefficient = dragCoefficient;
    this.gravity = gravity;
    this.airDensity = airDensity;
  }
}

export default ParticleDescriptor;
export { ParticleDescriptor, PhysicsParticleDescriptor}