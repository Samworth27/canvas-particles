const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const buffer = 100;

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

class Particle {
  dirMax = 1;

  constructor(x, y, dirX, dirY, size, colour) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.size = size;
    this.colour = colour;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();
  }

  update() {
    this.colour = "#8C5523";

    if (this.x > canvas.width - buffer) {
      this.colour = "#FF0000";
      this.dirX -= 0.5;
    }
    if (this.x < buffer) {
      this.colour = "#FF0000";
      this.dirX += 0.5;
    }
    if (this.y > canvas.height - buffer) {
      this.colour = "#0000FF";
      this.dirY -= 0.5;
    }
    if (this.y < buffer) {
      this.colour = "#0000FF";
      this.dirY += 0.5;
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x) {
        this.dirX += 0.1;
      }
      if (mouse.x > this.x) {
        this.dirX -= 0.1;
      }
      if (mouse.y < this.y) {
        this.dirY += 0.1;
      }
      if (mouse.y > this.y) {
        this.dirY -= 0.1;
      }
    }

    if (Math.abs(this.dirX) > 0.3) {
      this.dirX *= 0.99;
    }
    if (Math.abs(this.dirY) > 0.3) {
      this.dirY *= 0.99;
    }

    this.x += this.dirX;
    this.y += this.dirY;

    this.draw();
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - buffer - buffer) + buffer;
    let y = Math.random() * (innerHeight - buffer - buffer) + buffer;
    let dirX = Math.random() * 2 - 1;
    let dirY = Math.random() * 2 - 1;
    let colour = "#8C5523";

    particlesArray.push(new Particle(x, y, dirX, dirY, size, colour));
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