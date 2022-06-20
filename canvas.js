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
    this.acceleration = { linear: 0, angular: 0 };
    this.maxVelocity = { linear: 2, angular: 5 };
    this.size = size;
    this.colour = colour;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.strokeStyle = "#000000"
    ctx.strokeWidth = 1;
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.position.x, this.position.y+10);
    ctx.fill();
    
    
  }


  update() {
    this.colour = "#8C5523";

    if (this.position.x > canvas.width - buffer) {
      this.colour = "#FF0000";
      // rotate towards center
      this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
    }
    if (this.position.x < buffer) {
      this.colour = "#FF0000";
      // rotate towards center
      this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
    }
    if (this.position.y > canvas.height - buffer) {
      this.colour = "#0000FF";
      // rotate towards center
      this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
    }
    if (this.position.y < buffer) {
      this.colour = "#0000FF";
      // rotate towards center
      this.acceleration.angular += (this.velocity.theta - this.position.vectorTo(screenCenter).theta)
    }

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

    // Limit velocity

    

    // limit turn rate

    clamp(this.acceleration.angular, -5,5);
    // move
    this.velocity.theta += this.acceleration.angular;
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
    let position = new Vector2({ x: screenCenter.x, y: screenCenter.y/2 }); //new Vector2({x: Math.random() * (innerWidth - buffer - buffer) + buffer,y:Math.random() * (innerHeight - buffer - buffer) + buffer})
    let velocity = new Vector2({x: Math.random() * 6 - 3,y: Math.random() * 6 - 3});
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
