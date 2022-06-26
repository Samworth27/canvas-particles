import Particle from "./Particle.js";
import { HSLA } from "./ColourString.js";

class FireworkParticle extends Particle {
  constructor(container, id, colour, lifespan, x, y, context) {
    let size = Math.random() * 7 + 4;
    let position = new Vector2(x, y);
    let velocity = new Vector2();
    velocity.magnitude = Math.random() * 50 + 1;
    velocity.direction = Math.random() * 360;
    

    super(container, id, position, velocity, size, colour, context, lifespan);
  }

  applyFriction(dt) {
    super.applyFriction(dt, 5);
  }

  applyGravity(dt) {
    super.applyGravity(dt, 5);
  }

  getOlder(dt) {
    super.getOlder(dt);

    let a = 0.5 * (this.lifespan - 1);
    let ageFactor = 1 - Math.pow((this.age - a) / a, 5);
    this.colour.alpha = ageFactor;
    this.size = Math.max(0, 5 * ageFactor);
  }

  update(dt) {
    super.update(dt);
    if (Math.random() > 0.5 && this.age < 1) {
      this.instances.push(
        new FireworkSparkle(
          this.instances,
          this.instances.length,
          new HSLA(this.colour.hue, 100, 50, 1),
          Math.random() * 3 + 2,
          this.position.x,
          this.position.y,
          this.context
        )
      );
    }
    this.instances.forEach((instance) => {
      instance.update(dt);
      instance.getOlder(dt);
    });
    this.colour.luminosity = Math.sin(Math.random()*5*this.age)*10+50;
    this.logIfZero(this.colour.luminosity);
  }
}

class FireworkSparkle extends Particle {
  constructor(container, id, colour, lifespan, x, y, context) {
    let size = 1;
    let position = new Vector2(x, y);
    let velocity = new Vector2();
    velocity.magnitude = 1;
    velocity.direction = Math.random() * 360;
   

    super(container, id, position, velocity, size, colour, context, lifespan);
  }
  applyFriction(dt) {
    super.applyFriction(dt, 10);
  }
  applyGravity(dt) {
    super.applyGravity(dt, 2);
  }
  getOlder(dt) {
    super.getOlder(dt);
    let a = 0.5 * (this.lifespan - 1);
    let ageFactor = 1 - Math.pow((this.age - a) / a, 10);
    this.colour.alpha = ageFactor;
  }
  update(dt){
    super.update(dt);
    this.colour.luminosity = Math.floor(Math.random() * 50)+50;
  }
}

class FireworkContainer {
  constructor(colours, container, count, ...args) {
    this.instances = [];
    this.container = container;
    for (let i = 0; i < count; i++) {
      let lifespan = Math.random() * 2 + 3;
      let colour = colours[Math.floor(Math.random() * colours.length)];
      this.instances.push(
        new FireworkParticle(
          this.instances,
          this.instances.length,
          colour,
          lifespan,
          ...args
        )
      );
    }
  }
  update(dt) {
    for (let i = 0; i < this.instances.length; i++) {
      this.instances[i].update(dt);
    }
    for (let i = 0; i < this.instances.length; i++) {
      this.instances[i].getOlder(dt);
    }
    if (this.instances.length == 0) {
      this.container.splice(this.container.indexOf(this), 1);
    }
  }
}

class FireworkOppositeColours extends FireworkContainer {
  constructor(...args) {
    let colour1 = new HSLA(Math.floor(Math.random() * 360), 100, 50, 1);
    let colour2 = new HSLA(colour1.hue + (180 % 360), 100, 50, 1);
    let colours = [colour1, colour2];
    super(colours, ...args);
  }
}

export default FireworkContainer;
export { FireworkOppositeColours };
