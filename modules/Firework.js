import Particle from "./Particle.js";
import { HSLA } from "./ColourString.js";

class FireworkParticle extends Particle {
  static initialAngle = Math.random() * 360;
  constructor(container, id, colour, lifespan, x, y, context) {
    let size = 1;
    let position = new Vector2(x, y);
    let velocity = new Vector2();
    let alpha = 50;
    let delta = 360 / alpha;
    let variation = 10;
    let mass = 0.01;
    velocity.magnitude = Math.random()*10;
    velocity.direction = FireworkParticle.initialAngle + (Math.ceil(Math.random() * alpha))*delta + (Math.random()*variation - variation*0.5);
    
    super(container, id, position, velocity, size,mass, colour, context, lifespan);
  }

  getOlder(dt) {
    super.getOlder(dt);

    let a = 0.5 * (this.lifespan - 0.5);
    let ageFactor = 1 - Math.pow((this.age - a) / a, 5);
    this.colour.alpha = ageFactor;
    // this.size -= dt/1000;
  }

  update(dt) {
    super.update(dt);
    if (Math.random() > 0.75 && this.age > 1 && this.age < this.lifespan) {
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
  }
}

class FireworkSparkle extends Particle {
  constructor(container, id, colour, lifespan, x, y, context) {
    let size = 0.1;
    let position = new Vector2(x, y);
    let velocity = new Vector2();
    velocity.magnitude = 0.5;
    velocity.direction = Math.random() * 360;
    let mass = 0.00001;
   

    super(container, id, position, velocity, size,mass, colour, context, lifespan);
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
      let lifespan = Math.random()+3;
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
class FireworkTriadColours extends FireworkContainer {
  constructor(...args) {
    let colour1 = new HSLA(Math.floor(Math.random() * 360), 100, 50, 1);
    let colour2 = new HSLA(colour1.hue + (120 % 360), 100, 50, 1);
    let colour3 = new HSLA(colour2.hue + (120 % 360), 100, 50, 1);
    let colours = [colour1, colour2,colour3];
    super(colours, ...args);
  }
}

export default FireworkContainer;
export { FireworkOppositeColours, FireworkTriadColours };
