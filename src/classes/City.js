export default class City {
  constructor(canvas, x, pixelSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = x ;
    this.y = canvas.height - 10 * pixelSize;
    this.width = 12 * pixelSize;
    this.height = 5 * pixelSize;
    this.hp = 100;
    this.alive = true;
  }

  draw() {
    if (this.alive) {
      this.ctx.fillStyle = '#44CC44';
      this.ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    }
  }
}