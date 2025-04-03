import Missile from './Missile';

export default class Turret {
  ammo = 10;


  constructor(canvas, game) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height - 10 * game.pixelSize;
    this.radius = 5 *game.pixelSize;
    this.color = '#5599FF';
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
    renderAmmo(this);
    // UI => Desenha contador de mísseis

  }

  fireMissile(targetX, targetY) {
    if (this.ammo > 0) {
      this.game.missiles.push(new Missile(this.canvas, this.x, this.y, targetX, targetY, this.game));
      this.ammo--;
    }
  }
}


const renderAmmo = (game) => {
  game.ctx.fillStyle = game.textColor;
  game.ctx.font = `${game.uiFontSize}px Monospace Bold`;
  game.ctx.fillText(`AMMO: ${game.ammo}`, 10, 30);
}