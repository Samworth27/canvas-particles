import {Vector2} from './modules/Vectors.js';
import Firework, {FireworkOppositeColours, FireworkTriadColours} from './modules/Firework.js';
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
  let colour1 = new HSLA(Math.floor(Math.random()*360),100,50,1)
  let colour2 = new HSLA(colour1.hue + 180 % 360, 100, 50, 1)
  let colours = [colour1,colour2];
  particlesArray.push( new FireworkOppositeColours(particlesArray,200,screenCenter.x,screenCenter.y,ctx));
}

window.onclick = (event) => {
  // new Firework(container, options, context)
  // options = {
  //  count: 300,
  //  position: new Vector2(event.x,event.y)
  // }
  particlesArray.push( new FireworkTriadColours(particlesArray,200,event.x,event.y,ctx));
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
