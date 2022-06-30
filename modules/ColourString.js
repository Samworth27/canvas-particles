class ColourString {
  constructor() {}
}

class HSL extends ColourString {
  constructor(hue, saturation, luminosity) {
    super();
    this.hue = hue;
    this.saturation = saturation;
    this.luminosity = luminosity;
  }
}

class HSLA extends HSL {
  constructor(hue, saturation, luminosity, alpha) {
    super(hue, saturation, luminosity);
    this.alpha = alpha;
  }
  toString() {
    return `hsla(${this.hue},${this.saturation}%,${this.luminosity}%,${this.alpha})`;
  }
  clone() {
    return new HSLA(
      this.hue,
      this.saturation,
      this.luminosity,
      this.alpha
    );
  }
}

export { HSL, HSLA };
