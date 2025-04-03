import Explosion from './Explosion';

export default class EnemyMissile {
  elapsedTime = 0;
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.ctx = canvas.getContext('2d');
    this.startX = Math.random() * canvas.width;
    this.startY = -15;
    this.x = this.startX;
    this.y = this.startY;

    // Define um alvo aleatório (cidades ou base)
    const targets = [...game.cities.filter(city => city.alive), game.turret];
    const target = targets[Math.floor(Math.random() * targets.length)];
    this.targetX = target.x;
    this.targetY = target.y;

    this.speed = game.missileSpeed * game.timeScale;
    this.destroyed = false;

    // Calcula a direção
    const dx = this.targetX - this.startX;
    const dy = this.targetY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / distance) * this.speed * this.game.timeScale;
    this.vy = (dy / distance) * this.speed * this.game.timeScale;
  }

  update(game) {
    this.elapsedTime += game.deltaTime|| 0 * this.game.timeScale;

    // Calcula o progresso normalizado (0 a 1) para a expansão e contração
    const progress = this.expanding
      ? Math.min(this.elapsedTime / this.expandDuration * this.game.timeScale, 1)
      : Math.min((this.elapsedTime - this.expandDuration * this.game.timeScale) / this.contractDuration, 1);

    // Aplica a função ease-in-out ao progresso
    const easedProgress = this.easeInOut(progress);

    if (!this.destroyed) {
      this.x += this.vx;
      this.y += this.vy;

      // Verifica colisão com o solo ou alvos
      if (this.y >= this.targetY) {
        this.destroyed = true;

        // Verifica se atingiu uma cidade
        for (let i = 0; i < game.cities.length; i++) {
          const city = game.cities[i];
          if (city.alive && Math.abs(this.x - city.x) < city.width / 2) {
            city.alive = false;
            break;
          }
        }

        // Explosão quando atinge o alvo
        game.explosions.push(new Explosion(this.canvas, this.x, this.y, 1, this.game));
      }

      // Verifica colisão com explosões
      for (let i = 0; i < game.explosions.length; i++) {
        const explosion = game.explosions[i];
        if (explosion.active) {
          const dx = this.x - explosion.x;
          const dy = this.y - explosion.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < explosion.radius) {
            if (dy <= -0.5) {
              game.score += 25;
            }
            this.destroyed = true;
            break;
          }
        }
      }
    } else {
      this.game.timeScale = 0.25;
      this.game.timeScale = easedProgress * 1;
    }
  }

  draw() {
    if (!this.destroyed) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.x, this.y);
      this.ctx.strokeStyle = '#FF0000';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  easeInOut(t) {
    // Função de interpolação (ease-in-out quadrática)
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}