import Vector2 from './modules/Vector2.js';
import Emitter from './modules/emitter.js';
import {HSLA} from './modules/ColourString.js';

window.Vector2 = Vector2
window.Firework = Firework

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const buffer = 100;
const screenCenter = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
let particlesArray = [];

function init() {
  particlesArray = [];
  window.particles = particlesArray
  let emitter = new Emitter();
}

window.onclick = (event) => {

}


let previousTick = 0;

function animate(tick) {
  tick = tick || 1
  let dt = tick - previousTick;
  // console.log(`fps: ${Math.round(1000/dt)}`)
  
  // ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update(dt);
  }
  requestAnimationFrame(animate);
  previousTick = tick
}


init();
animate();
