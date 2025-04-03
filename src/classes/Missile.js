import Explosion from './Explosion';

export default class Missile {
  constructor(canvas, startX, startY, targetX, targetY, game) {
    this.game = game;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 5 * game.timeScale;
    this.exploded = false;

    // Calcula a direção
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / distance) * this.speed * this.game.timeScale;
    this.vy = (dy / distance) * this.speed * this.game.timeScale;
  }

  update(game) {
    if (!this.exploded) {
      // Atualiza a posição do míssil
      this.x += this.vx * game.timeScale;
      this.y += this.vy * game.timeScale;

      // Verifica se o míssil passou pelo destino
      const dx = this.targetX - this.startX;
      const dy = this.targetY - this.startY;
      const missilePathLength = Math.sqrt(dx * dx + dy * dy);

      const currentDx = this.x - this.startX;
      const currentDy = this.y - this.startY;
      const currentDistance = Math.sqrt(currentDx * currentDx + currentDy * currentDy);

      if (currentDistance >= missilePathLength) {
        this.exploded = true;
        game.explosions.push(new Explosion(this.canvas, this.x, this.y, 1, this.game));
      }
    }
  }

  draw() {
    if (!this.exploded) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.x, this.y);
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
}