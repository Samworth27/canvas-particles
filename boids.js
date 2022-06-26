import BoidsContainer from './modules/Boid.js';
import {HSLA} from './modules/ColourString.js';

window.BoidsContainer = BoidsContainer;

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let Boids

function init() {
  Boids = new BoidsContainer(canvas,context);
  window.Boids = Boids;
}



let previousTick = 0;

function animate(tick) {
  tick = tick || 1
  let dt = tick - previousTick;
  // console.log(`fps: ${Math.round(1000/dt)}`)
  
  context.clearRect(0, 0, innerWidth, innerHeight);
  Boids.update(dt);
  requestAnimationFrame(animate);
  previousTick = tick
}


init();
animate();
