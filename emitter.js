import { Vector2 } from "./modules/Vectors.js";
import { Emitter, ParticleDescriptor } from "./modules/Emitter.js";
import { HSLA } from "./modules/ColourString.js";
import { createCanvas } from "./modules/Canvas.js";

let FPSHistory = [];
let previousTick = 0;
function animate(canvas, tick = 15) {
  canvas.ctx.clearRect(0, 0, innerWidth, innerHeight);
  let dt = Number(((tick - previousTick) / 1000).toPrecision(6));
  let fps = Number((1000 / (dt * 1000)).toPrecision(2));
  FPSHistory.push(fps);
  if (FPSHistory.length > 60) {
    FPSHistory.splice(0, 1);
  }
  window.fps = Math.round(FPSHistory.reduce((a, b) => a + b) / FPSHistory.length);
  canvas.draw(dt);
  previousTick = tick;
  requestAnimationFrame((tick) => animate(canvas, tick));
}

const canvas = createCanvas();

let particle = new ParticleDescriptor(
  10,
  new HSLA(90, 50, 50, 1),
  "circle",
  20,
  "normal"
);
let particle1 = new ParticleDescriptor(
  10,
  new HSLA(90, 50, 50, 1),
  "circle",
  20,
  "sin"
);
let particle2 = new ParticleDescriptor(
  10,
  new HSLA(270, 50, 50, 1),
  "circle",
  20,
  "alt-sin"
);

let particles = [particle1, particle2];

let options = {
  direction: "spin",
  spinSpeed: 3400,
  selectionMode: "random",
  linkMode: "all",
  // colourMode: "cycle",
  // colourCycleSpeed: 360
};
let emitter = new Emitter(canvas, particle, new Vector2(200, 300), 84, 0.5,options);

canvas.emitters.push(emitter);

animate(canvas);
