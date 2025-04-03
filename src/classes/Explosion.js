export default class Explosion {
  constructor(canvas, x, y, ampDuration = 1, game) {
    this.ctx = canvas.getContext('2d');
    this.game = game;
    this.x = x;
    this.y = y;
    this.radius = 2 * game.pixelSize;
    this.maxRadius = 15 * game.pixelSize;
    this.explosionDuration = 1500 * ampDuration; // Duração total da explosão
    this.expandDuration = this.explosionDuration * 0.25; // Tempo para expandir
    this.contractDuration = this.explosionDuration * 0.75; // Tempo para contrair
    this.elapsedTime = 0; // Tempo decorrido
    this.expanding = true;
    this.active = true;

    // Propriedades de cor e opacidade
    this.red = 255;
    this.green = 255;
    this.blue = 0;
    this.alpha = 0.85;

    // Partículas
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < 4; i++) {
      const randomX = this.x + (Math.random() * 2 - 1) * this.game.pixelSize;
      const randomY = this.y + (Math.random() * 2 - 1) * this.game.pixelSize;
      this.particles.push({
        x: randomX,
        y: randomY,
        size: (Math.random() * this.radius) * this.game.pixelSize,
        speed: (Math.random() * 5 + 1) * this.game.timeScale,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  update(deltaTime) {
    if (!this.active) return;

    this.elapsedTime += deltaTime * this.game.timeScale;

    // Calcula o progresso normalizado (0 a 1) para a expansão e contração
    const progress = this.expanding
      ? Math.min(this.elapsedTime / this.expandDuration * this.game.timeScale, 1)
      : Math.min((this.elapsedTime - this.expandDuration * this.game.timeScale) / this.contractDuration, 1);

    // Aplica a função ease-in-out ao progresso
    const easedProgress = this.easeInOut(progress);

    // Atualiza o raio com base no progresso suavizado
    if (this.expanding) {
      this.radius = 2 * this.game.pixelSize + easedProgress * (this.maxRadius - 2 * this.game.pixelSize);
      if (progress >= 1) {
        this.expanding = false;
        this.elapsedTime = this.expandDuration; // Ajusta o tempo para iniciar a contração
      }
    } else {
      this.radius = this.maxRadius - easedProgress * (this.maxRadius - 2 * this.game.pixelSize);
      if (progress >= 1) {
        this.active = false; // Marca a explosão como inativa
      }
    }

    // Atualiza as cores e a opacidade
    if (this.expanding) {
      this.green = Math.max(this.green - (255 / this.expandDuration) * deltaTime, 0);
      this.alpha = Math.max(this.alpha - (0.4 / this.contractDuration) * deltaTime, 0);
    } else {
      this.alpha = Math.max(this.alpha - (0.6 / this.contractDuration) * deltaTime, 0);
    }

    this.updateParticles(deltaTime);
  }

  updateParticles(deltaTime) {
    const maxDistance = this.maxRadius / 2; // Metade do tamanho máximo da expansão da explosão

    this.particles.forEach((particle) => {
      // Calcula o progresso normalizado (0 a 1) com base no tempo de vida da explosão
      const progress = this.expanding
        ? Math.min((this.elapsedTime / this.expandDuration), Math.random() * 2 )
        : Math.min((this.elapsedTime / this.expandDuration), Math.random() * 0.8 );

      // Aplica a função ease-in-out ao progresso
      const easedProgress = this.easeInOut(progress);

      // Calcula o deslocamento com base no easing e no alcance máximo
      const distance = (easedProgress * maxDistance) ;
      const dx = Math.cos(particle.angle) * Math.random() * distance;
      const dy = Math.sin(particle.angle) * Math.random() * distance;

      // Atualiza a posição da partícula
      particle.x = this.x + dx;
      particle.y = this.y + dy;
      particle.radius = particle.radius - 1 ;
    });
  }

  draw() {
    if (!this.active) return;

    // Desenha a explosão
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    this.ctx.fill();
    this.ctx.closePath();

    // Desenha as partículas
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 0, ${this.alpha / 3})`;
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  easeInOut(t) {
    // Função de interpolação (ease-in-out quadrática)
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}