class Canvas {
  #canvas;
  #ctx;
  #fill;
  #stroke;

  constructor(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;

    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
  }

  getCanvas() {
    return this.#canvas;
  }

  getContext() {
    return this.#ctx;
  }

  setBackground(color) {
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(0, 0, this.width, this.height);
  }

  setFill(color) {
    if (color instanceof LinearGradient || color instanceof RadialGradient)
      color = color.getGradient();

    this.#fill = true;
    this.#ctx.fillStyle = color;
  }

  noFill() {
    this.#fill = false;
  }

  setStroke(color) {
    if (color instanceof LinearGradient || color instanceof RadialGradient)
      color = color.getGradient();
    this.#stroke = true;
    this.#ctx.strokeStyle = color;
  }

  setStrokeWeight(weight) {
    this.#stroke = true;
    this.#ctx.lineWidth = weight;
  }

  setStrokeCap(cap) {
    if (!(cap == "round" || cap == "butt" || cap == "square")) return;
    this.#ctx.lineCap = cap;
  }

  noStroke() {
    this.#stroke = false;
  }

  linearGradient(x1, y1, x2, y2) {
    let gradient = this.#ctx.createLinearGradient(x1, y1, x2, y2);
    return gradient;
  }

  rectangle(x, y, width, height) {
    if (this.#fill) this.#ctx.fillRect(x, y, width, height);
    if (this.#stroke) this.#ctx.strokeRect(x, y, width, height);
  }

  ellipse(x, y, radiusX, radiusY) {
    if (radiusY == null) radiusY = radiusX;
    this.#ctx.beginPath();
    this.#ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    if (this.#stroke) this.#ctx.stroke();
    if (this.#fill) this.#ctx.fill();
  }

  line(x1, y1, x2, y2) {
    if (!this.#stroke) return;

    this.#ctx.beginPath();
    this.#ctx.moveTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.stroke();
  }
}

class CanvasBuilder {
  #canvas;
  #parent;

  constructor() {
    this.#canvas = document.createElement("canvas");
    this.#parent = document.body;
    return this;
  }

  setId(idName) {
    this.#canvas.id = idName;
    return this;
  }

  addClass(className) {
    this.#canvas.classList.add(className);
    return this;
  }

  setParent(parentId) {
    this.#parent = document.getElementById(parentId);
    return this;
  }

  setSize(width, height) {
    this.#canvas.width = width;
    this.#canvas.height = height;
    return this;
  }

  build() {
    this.#parent.appendChild(this.#canvas);
    return new Canvas(this.#canvas);
  }
}

class Color {
  static HEX(code) {
    let string = code.toString().startsWith("#") ? code : "#" + code;

    let match = string.match(/^#([0-9a-f]{6})$/i);
    if (match) {
      return match[0];
    } else {
      return "#000000";
    }
  }

  static HSL(hue, saturation, lightness) {
    return `hsl(${hue % 360},${clampNumber(saturation, 0, 100)}%,${clampNumber(
      lightness,
      0,
      100
    )}%)`;
  }

  static HSLA(hue, saturation, lightness, alpha) {
    return `hsla(${hue % 360}, ${clampNumber(
      saturation,
      0,
      100
    )}%, ${clampNumber(lightness, 0, 100)}%, ${clampNumber(alpha, 0, 1)})`;
  }

  static RGB(red, green, blue) {
    return `rgb(${clampNumber(red, 0, 255)}, ${clampNumber(
      green,
      0,
      255
    )},${clampNumber(blue, 0, 255)})`;
  }

  static RGBA(red, green, blue, alpha) {
    return `rgba(${clampNumber(red, 0, 255)}, ${clampNumber(
      green,
      0,
      255
    )},${clampNumber(blue, 0, 255)},${(alpha, 0, 1)})`;
  }

  static GS(lightness) {
    return `rgb(${clampNumber(lightness, 0, 255)},${clampNumber(
      lightness,
      0,
      255
    )},${clampNumber(lightness, 0, 255)})`;
  }

  static GSA(lightness, alpha) {
    return `rgba(${clampNumber(lightness, 0, 255)},${clampNumber(
      lightness,
      0,
      255
    )},${clampNumber(lightness, 0, 255)}, ${clampNumber(alpha, 0, 1)})`;
  }
}

class LinearGradient {
  #gradient;
  constructor(x1, y1, x2, y2, canvas) {
    this.#gradient = canvas.getContext().createLinearGradient(x1, y1, x2, y2);
  }

  addColorStop(position, color) {
    this.#gradient.addColorStop(position, color);
    return this;
  }

  getGradient() {
    return this.#gradient;
  }
}

class RadialGradient {
  #gradient;
  constructor(x1, y1, radius1, x2, y2, radius2, canvas) {
    this.#gradient = canvas
      .getContext()
      .createRadialGradient(x1, y1, radius1, x2, y2, radius2);
  }

  addColorStop(position, color) {
    this.#gradient.addColorStop(position, color);
    return this;
  }

  getGradient() {
    return this.#gradient;
  }
}

class XMaths {
  static random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }

    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }

    max = Math.floor(max);
    min = Math.ceil(min);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

function clampNumber(number, min, max) {
  return Math.min(Math.max(number, min), max);
}
