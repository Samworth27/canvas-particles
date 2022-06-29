import {Vector2} from './../Vectors.js'

class Particle {
  constructor(descriptor, position, velocity, canvas) {
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.movement = descriptor.movement;
    this.acceleration = new Vector2();
    this.size = descriptor.size;
    this.colour = descriptor.colour;
    this.shape = descriptor.shape;
    this.lifespan = descriptor.lifespan;
    this.canvas = canvas;
    this.forces = [];
    this.age = 0;
    this.links = [];

    switch (this.movement) {
      case "sin":
        this.velocity.direction -= 60;
        break;
      case "alt-sin":
        this.velocity.direction += 60;
        break;
      case "random-sin":
        this.coinflip = Math.round(Math.random()) == 0;
        this.velocity.direction -= this.coinflip ? 60 : -60;
        break;
    }
  }

  rebuild(descriptor, position, velocity, canvas) {
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.movement = descriptor.movement;
    this.acceleration = new Vector2();
    this.size = descriptor.size;
    this.colour = descriptor.colour;
    this.shape = descriptor.shape;
    this.lifespan = descriptor.lifespan;
    this.canvas = canvas;
    this.forces = [];
    this.age = 0;
    this.links = [];

    switch (this.movement) {
      case "sin":
        this.velocity.direction -= 60;
        break;
      case "alt-sin":
        this.velocity.direction += 60;
        break;
      case "random-sin":
        this.coinflip = Math.round(Math.random()) == 0;
        this.velocity.direction -= this.coinflip ? 60 : -60;
        break;
    }
  }

  

  getOlder(dt) {
    this.age += dt;
    this.colour.alpha = 1 - this.age / this.lifespan;
  }

  move(dt) {
    this.velocity.add(this.acceleration.scale(dt));

    // special movement cases
    switch (this.movement) {
      case "sin":
        this.velocity.direction += Math.sin(this.age);
        break;
      case "alt-sin":
        this.velocity.direction += Math.sin(-this.age);
        break;
      case "random-sin":
        this.velocity.direction += Math.sin(
          this.coinflip ? this.age : -this.age
        );
        break;
    }

    this.position.add(this.velocity.clone().scale(dt * 100));
  }

  draw() {
    let ctx = this.canvas.ctx;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
    this.links.forEach((link) => {
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(link.particle.position.x, link.particle.position.y);
      ctx.strokeStyle = link.colour;
      ctx.stroke();
    });
  }

  reset() {}

  update(dt) {
    this.getOlder(dt);
    this.move(dt);
    this.draw();
    this.reset();
  }

  get isDead() {
    return this.age > this.lifespan;
  }
}
export default Particle;
export {Particle};