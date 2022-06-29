import { Vector2 } from "./../Vectors.js";
import Particle from "./Particle.js";

/**
 * options:  
 *  
 * directionMode: ['set','spin','random'] - defaults to 'random'    
 * direction: [number] - use with directionMode 'set'  
 * spinSpeed: [number] - use with directionMode 'spin'  
 * 
 * selectionMode: ['sequential','random'] - if the emitter is provided with an
 * array of particle descriptors, this defines how the emitter picks the next particle
 * to spawn. Defaults to 'random'
 * 
 * linkMode: ['all', 'alternate', 'none] - how often to link particles
 * 
 * colourMode: ['set','cycle','random'] - defaults to 'set'
 * colourCycleSpeed: [number] - use with colourMode 'cycle'
 * note: using any colour mode except 'set' will cause a slowdown
 */
class Emitter {
  constructor(canvas, descriptor, position, rate, force, options = {}) {
    this.canvas = canvas;
    this.descriptor = descriptor;
    this.position = position;
    this.rate = 1 / rate;
    this.force = force;
    this.particles = [];
    this.lastSpawn = this.rate + 1;
    this.pool = [];

    // define direction related properties
    this.directionMode = options.direction || "random";
    switch (this.directionMode) {
      case "set":
        this.direction = options.direction || 0;
        break;
      case "spin":
        this.direction = 0;
        this.spinSpeed = options.spinSpeed || 0;
        break;
    }
    // define selector decision related properties
    this.selectionMode = options.selectionMode || "random";
    switch (this.selectionMode) {
      case "sequential":
        this.descriptorIndex = 0;
        break;
    }
    // define linking related properties
    this.linkMode = options.linkMode || "none";
    switch (this.LinkMode) {
      case "alternate":
        this.link = false;
        break;
    }
    // colour related properties
    this.colourMode = options.colourMode || "set";
    switch (this.colourMode) {
      case "cycle":
        this.colourCycleSpeed = options.colourCycleSpeed || 0;
        break;
    }
  }

  spawnParticle(dt) {
    let velocity = new Vector2(0, this.force);
    // define the particles initial direction
    switch (this.directionMode) {
      case "set":
        velocity.direction = this.direction;
        break;
      case "spin":
        velocity.direction = this.direction;
        this.direction += this.spinSpeed * dt;
        break;
      default:
        velocity.direction = Math.random() * 360;
        break;
    }

    // pick a descriptor to use
    let descriptor;
    if (typeof this.descriptor.length == "undefined") {
      descriptor = this.descriptor;
    } else {
      switch (this.selectionMode) {
        case "alternate":
          descriptor = this.descriptor[this.descriptorIndex];
          this.descriptorIndex =
            (this.descriptorIndex + 1) % this.descriptor.length;
          break;
        default:
          descriptor =
            this.descriptor[Math.floor(Math.random() * this.descriptor.length)];
      }
    }

    let newParticle;
    if (this.pool.length > 0) {
      newParticle = this.pool.pop();
      newParticle.rebuild(descriptor, this.position, velocity, this.canvas);
    } else {
      newParticle = new Particle(
        descriptor,
        this.position,
        velocity,
        this.canvas
      );
    }

    // define particle colour
    let colour;
    switch (this.colourMode) {
      case "random":
        colour = Object.create(newParticle.colour);
        colour.hue = Math.random() * 360;
        newParticle.colour = colour;
        break;
      case "cycle":
        let lastParticle = this.particles.slice(-1)[0] || descriptor;
        colour = Object.create(lastParticle.colour);
        colour.hue += this.colourCycleSpeed * dt;
        newParticle.colour = colour;
        break;
    }
    

    switch (this.linkMode) {
      case "alternate":
        if (this.link) {
          let target = this.particles.slice(-1)[0];
          let linkColour = newParticle.colour;
          newParticle.links.push({ particle: target, colour: linkColour });
          this.link = !this.link;
        } else {
          this.link = !this.link;
        }
        break;
      case "all":
        if (this.particles.length > 0) {
          let target = this.particles.slice(-1)[0];
          let linkColour = newParticle.colour;
          newParticle.links.push({ particle: target, colour: linkColour });
        }
        break;
    }

    this.particles.push(newParticle);
  }

  update(dt) {
    if (this.lastSpawn > this.rate) {
      this.spawnParticle(dt);
      this.lastSpawn = 0;
    } else {
      this.lastSpawn += dt;
    }

    this.particles.forEach((particle) => {
      particle.update(dt);
      if (particle.isDead) {
        let index = this.particles.indexOf(particle);
        this.pool.push(this.particles.splice(index, 1)[0]);
      }
    });
    console.log(
      `FPS: ${window.fps} | particles: ${this.particles.length} | pool: ${this.pool.length}`
    );
  }

  get isDead() {
    return false;
  }
}

export { Emitter };
