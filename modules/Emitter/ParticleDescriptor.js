class ParticleDescriptor {
  constructor(size, colour, shape, lifespan, movement = "normal") {
    this.size = size;
    this.colour = colour;
    this.shape = shape;
    this.lifespan = lifespan;
    this.movement = movement;
  }
}
export {ParticleDescriptor};