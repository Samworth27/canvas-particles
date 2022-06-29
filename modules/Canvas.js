function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.ctx = canvas.getContext("2d");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.background = "radial-gradient(#121212, #000000)";
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.emitters = [];
  canvas.draw = function (dt) {
    this.emitters.forEach((emitter) => {
      emitter.update(dt);
      if (emitter.isDead) {
        console.log("Dead emitter");
        this.emitters.splice(this.emitters.indexOf(emitter), 1);
      }
    });
  };

  return canvas;
}

export {createCanvas}