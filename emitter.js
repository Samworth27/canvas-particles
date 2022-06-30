import { Vector2 } from "./modules/Vectors.js";
import {
  Emitter,
  ParticleDescriptor,
  PhysicsParticleDescriptor,
} from "./modules/Emitter.js";
import { HSLA } from "./modules/ColourString.js";
import { createCanvas } from "./modules/Canvas.js";

const mousePosition = new Vector2();
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
  colourCycleSpeed: 3410,
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
let smokePhysicsParticle = [
  new PhysicsParticleDescriptor(
    0.0001,
    0.1,
    -9.8,
    1.2,
    new ParticleDescriptor(10, new HSLA(90, 5, 10, 1), "circle", 3, "normal")
  ),
  new PhysicsParticleDescriptor(
    0.001,
    0.91,
    -9.8,
    1.2,
    new ParticleDescriptor(4, new HSLA(0, 100, 50, 1), "circle", 0.5, "normal")
  ),
  new PhysicsParticleDescriptor(
    0.0001,
    0.1,
    -9.8,
    1.2,
    new ParticleDescriptor(2, new HSLA(50, 100, 50, 1), "circle", 1, "normal")
  ),
];

let physicsOptions = {
  physicsMode: "full",
  colourMode: "set",
};

let physicsEmitter = new Emitter(
  canvas,
  smokePhysicsParticle,
  new Vector2(innerWidth - 300, innerHeight / 2),
  // mousePosition,
  300,
  0.5,
  physicsOptions
);

let smokeCoverup = new Emitter(
  canvas,
  [
    new PhysicsParticleDescriptor(
      0.0001,
      0.1,
      -9.8,
      1.2,
      new ParticleDescriptor(10, new HSLA(0, 100, 50, 1), "circle", 0.3)
    ),
    new PhysicsParticleDescriptor(
      0.001,
      0.1,
      -9.8,
      1.2,
      new ParticleDescriptor(10, new HSLA(60, 50, 50, 1), "circle", 0.3)
    ),
  ],
  new Vector2(innerWidth - 300, innerHeight / 2),
  // mousePosition,
  60,
  0.5,
  { physicsMode: "full" }
);

canvas.emitters.push(fibEmitter);
canvas.emitters.push(oppositeSinEmitter);
// canvas.emitters.push(lastEmitter);
canvas.emitters.push(physicsEmitter);
canvas.emitters.push(smokeCoverup);

document.addEventListener("click", (event)=>{
  const position = new Vector2(event.clientX,event.clientY);
  const particle = new ParticleDescriptor(2,new HSLA(120, 50, 50,1),'circle',5,'normal')
  const options = {
    spawnMode: 'burst'
  }
  const emitter = new Emitter(canvas, particle, position, 100, 1, options)
  canvas.emitters.push(emitter);

})

animate(canvas);
