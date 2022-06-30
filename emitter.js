import { Vector2 } from "./modules/Vectors.js";
import {
  Emitter,
  ParticleDescriptor,
  PhysicsParticleDescriptor,
} from "./modules/Emitter.js";
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
  window.fps = Math.round(
    FPSHistory.reduce((a, b) => a + b) / FPSHistory.length
  );
  canvas.draw(dt);
  previousTick = tick;
  requestAnimationFrame((tick) => animate(canvas, tick));
}

const canvas = createCanvas();

let fibParticle = new ParticleDescriptor(
  10,
  new HSLA(90, 50, 50, 1),
  "circle",
  20
);

let fibOptions = {
  directionMode: "spin",
  spinSpeed: 3400,
  linkMode: "all",
  colourMode: "cycle",
  colourCycleSpeed: 3410
};

let fibEmitter = new Emitter(
  canvas,
  fibParticle,
  new Vector2(200, 300),
  54,
  0.5,
  fibOptions
);

let oppositeSinParticles = [
  new ParticleDescriptor(10, new HSLA(0, 50, 50, 1), "circle", 15, "alt-sin"),
  new ParticleDescriptor(10, new HSLA(180, 50, 50, 1), "circle", 15, "sin"),
];

let oppositeSinOptions = {
  directionMode: "set",
  direction: 90,
  selectionMode: "sequential",
  linkMode: "alternate",
};

let oppositeSinEmitter = new Emitter(
  canvas,
  oppositeSinParticles,
  new Vector2(innerWidth / 2, 0),
  15,
  1,
  oppositeSinOptions
);

// let lastParticles = [
//   new ParticleDescriptor(10, new HSLA(0, 50, 100, 1), "circle", 15, "sin"),
//   new ParticleDescriptor(10, new HSLA(270, 50, 50, 1), "circle", 15, "sin-alt"),
//   new ParticleDescriptor(10, new HSLA(270, 50, 50, 1), "circle", 15, "sin-alt"),
//   new ParticleDescriptor(10, new HSLA(0, 50, 100, 1), "circle", 15, "sin"),
// ];

// let lastOptions = {
//   directionMode: "spin",
//   spinSpeed: 360,
//   selectionMode: "sequential",
//   linkMode: "all",
// };

// let lastEmitter = new Emitter(
//   canvas,
//   lastParticles,
//   new Vector2(innerWidth - 300, innerHeight / 2),
//   10,
//   1,
//   lastOptions
// );

// physics particle
let smokeParticle = new ParticleDescriptor(
  5,
  new HSLA(90, 5, 10, 1),
  "circle",
  3,
  "normal"
);

let smokePhysicsParticle = new PhysicsParticleDescriptor(
  0.1,
  0.9,
  -1,
  1.2,
  smokeParticle
);

let physicsOptions = {
  physicsMode: "full",
  colourMode: "random"
};

let physicsEmitter = new Emitter(canvas,smokePhysicsParticle,new Vector2(innerWidth - 300, innerHeight / 2 ),300,0.2,physicsOptions)



canvas.emitters.push(fibEmitter);
canvas.emitters.push(oppositeSinEmitter);
// canvas.emitters.push(lastEmitter);
canvas.emitters.push(physicsEmitter);

animate(canvas);
