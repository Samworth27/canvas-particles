import { Vector2 } from "./Vector2.js";
window.Vector2 = Vector2;

const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const buffer = 100;
const screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let particlesArray;

let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function vectorTo(from, to) {}

class Particle {
  constructor(position, velocity, size, colour) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector2({ x: 0, y: 0 })
    this.maxVelocity = { linear: 2, angular: 1 };
    this.size = size;
    this.colour = colour;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.strokeStyle = "#000000";
    ctx.strokeWidth = 1;
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.position.x, this.position.y + 10);
    ctx.fill();
  }

  avoidEdges() {
    if (this.position.x > canvas.width - buffer) {
      this.colour = "#FF0000";
      // rotate towards center
      // this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
      this.acceleration.x = screenCenter.x - this.position.x;
      this.acceleration.y = screenCenter.y - this.position.y;
    }
    if (this.position.x < buffer) {
      this.colour = "#FF0000";
      // rotate towards center
      // this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
      this.acceleration.x = screenCenter.x - this.position.x;
      this.acceleration.y = screenCenter.y - this.position.y;
    }
    if (this.position.y > canvas.height - buffer) {
      this.colour = "#0000FF";
      // rotate towards center
      // this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
      this.acceleration.x = screenCenter.x - this.position.x;
      this.acceleration.y = screenCenter.y - this.position.y;
    }
    if (this.position.y < buffer) {
      this.colour = "#0000FF";
      // rotate towards center
      // this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
      this.acceleration.x = screenCenter.x - this.position.x;
      this.acceleration.y = screenCenter.y - this.position.y;
    }
  }

  update() {
    this.colour = "#8C5523";
    this.avoidEdges();

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x) {
        // rotate away from cursor
      }
      if (mouse.x > this.x) {
        // rotate away from cursor
      }
      if (mouse.y < this.y) {
        // rotate away from cursor
      }
      if (mouse.y > this.y) {
        // rotate away from cursor
      }
    }



    // limit turn rate
    let oldTheta = this.velocity.theta;
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    let deltaTheta = 180 - ((180 - this.velocity.theta + oldTheta) % 360);
    if (deltaTheta > this.maxVelocity.angular) {
      if (deltaTheta > 0) {
        this.velocity.theta = oldTheta + this.maxVelocity;
      } else {
        this.velocity.theta = oldTheta - this.maxVelocity;
      }
    }
    this.velocity.r = clamp(this.velocity.r,0,this.maxVelocity.linear)

    // move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
    window.particlesArray = particlesArray;
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let position = new Vector2({ x: screenCenter.x, y: screenCenter.y / 2 }); //new Vector2({x: Math.random() * (innerWidth - buffer - buffer) + buffer,y:Math.random() * (innerHeight - buffer - buffer) + buffer})
    let velocity = new Vector2({
      x: Math.random() * 6 - 3,
      y: Math.random() * 6 - 3,
    });
    let colour = "#8C5523";

    particlesArray.push(new Particle(position, velocity, size, colour));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 10) * (canvas.height / 10)) {
        ctx.strokeStyle = "rgba(140,85,31,1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

init();
animate();
