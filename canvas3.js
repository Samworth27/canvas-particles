import Vector2 from './Vector2.js';
import Particle from './Particle.js';

window.Vector2 = Vector2
window.Particle = Particle

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const buffer = 100;
const screenCenter = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
Particle.screenCenter = screenCenter
let particlesArray = [];

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  // let numberOfParticles = 1;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 7 + 4;
    let position = new Vector2(screenCenter.x, screenCenter.y); //new Vector2(Math.random() * (innerWidth - buffer - buffer) + buffer,Math.random() * (innerHeight - buffer - buffer) + buffer)
    let velocity = new Vector2();
    velocity.direction = (Math.random() * 360)
    velocity.magnitude = Math.random() * Particle.maxSpeed;
    let colour = "#8C5523";
    let particle = new Particle(position, velocity, size, colour, ctx)
    particlesArray.push(particle);
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    if(Vector2.subtract(screenCenter, particlesArray[i].position).magnitude > Math.random() * 2000+1000){
      particlesArray[i].position = new Vector2(screenCenter.x, screenCenter.y)
    }
  }
}

window.particles = particlesArray
init();
animate();
