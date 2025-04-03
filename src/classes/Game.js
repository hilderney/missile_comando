import { GAME_STATE } from '../constants/GameStates';
import Turret from './Turret';
import City from './City';
import EnemyMissile from './EnemyMissile';

export default class Game {
  textColor = '#FFFFFF66';
  dificulty = 1;
  score = 0;
  level = 1;
  cities = [];
  missiles = [];
  enemyMissiles = [];
  explosions = [];
  turret = null;
  lastTime = 0;
  missileSpawnRate = 3000;
  missileSpeed = 4;
  lastMissileSpawn = 0;
  totalCities = 8;
  deltaTime = 0;
  timeScale = 1;

  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GAME_STATE.PLAYING;
    this.playerId = config.playerId;
    this.playerName = config.playerName;
    this.playerHighscore = config.playerHighscore;
    this.pixelSize = config.resolutionIndex;
    this.uiFontSize = (16 + this.pixelSize * 1.5);
    this.initGame();
    this.setupEventListeners();
  }

  initGame() {
    // Cria a base defensiva
    this.turret = new Turret(this.canvas, this);

    // Cria as cidades (8 cidades igualmente espaçadas)
    this.resetCities();
  }

  resetCities() {
    const spacing = this.canvas.width / (this.totalCities + 1);
    for (let i = 1; i <= this.totalCities; i++) {
      this.cities.push(new City(this.canvas, i * spacing, this.pixelSize));
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      if (this.state === GAME_STATE.PLAYING) {
        this.turret.fireMissile(clickX, clickY);
      } else if (this.state === GAME_STATE.GAME_OVER) {
        this.resetGame();
      }
    });
  }

  resetGame() {
    // Reinicia o jogo
    this.state = GAME_STATE.PLAYING;
    this.score = 0;
    this.missiles = [];
    this.enemyMissiles = [];
    this.explosions = [];
    this.cities = [];
    this.dificulty = 1;

    // Reinicializa a base
    this.turret = new Turret(this.canvas, this);

    // Reinicializa as cidades
    this.resetCities();
  }

  update(timestamp) {
    this.deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.state !== GAME_STATE.PLAYING) return;

    // Atualiza mísseis defensivos
    for (let i = 0; i < this.missiles.length; i++) {
      this.missiles[i].update(this);
    }

    // Atualiza mísseis inimigos
    for (let i = 0; i < this.enemyMissiles.length; i++) {
      this.enemyMissiles[i].update(this);
    }

    // Atualiza explosões
    for (let i = 0; i < this.explosions.length; i++) {
      this.explosions[i].update(this.deltaTime);
    }

    // Spawna novos mísseis inimigos
    if (timestamp - this.lastMissileSpawn > this.missileSpawnRate) {
      this.enemyMissiles.push(new EnemyMissile(this.canvas, this));
      this.lastMissileSpawn = timestamp;
    }

    // Remove mísseis e explosões inativas
    this.missiles = this.missiles.filter(missile => !missile.exploded || missile.y < 0);
    this.enemyMissiles = this.enemyMissiles.filter(missile => !missile.destroyed || missile.y < 0);
    this.explosions = this.explosions.filter(explosion => explosion.active);

    // Verifica condição de Game Over
    const allCitiesDestroyed = this.cities.every(city => !city.alive);
    if (allCitiesDestroyed) {
      this.state = GAME_STATE.GAME_OVER;
    }
  }

  render() {
    // Limpa o canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenha o terreno
    this.ctx.fillStyle = '#553300';
    this.ctx.fillRect(0, this.canvas.height - 10 * this.pixelSize, this.canvas.width * this.pixelSize, 10 * this.pixelSize);

    renderCities(this);
    renderTurret(this);
    renderDefensiveMissiles(this);
    renderEnemyMissiles(this);
    renderExplosions(this);
    renderScore(this);
    renderDebugger(this);

    if (this.state === GAME_STATE.GAME_OVER) {
      renderGameOver(this);
    }
  }

  gameLoop(timestamp) {
    this.update(timestamp);
    this.render();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  start() {
    this.gameLoop(0);
  }
}

const renderScore = (game) => {
  game.ctx.fillStyle = game.textColor;
  game.ctx.font = `${game.uiFontSize}px Monospace`;
  game.ctx.textAlign = 'right';
  game.ctx.fillText(`SCORE: ${game.score}`, game.canvas.width - 10, 30 * game.pixelSize);
  game.ctx.textAlign = 'left';


};

const renderCities = (game) => {
  for (let i = 0; i < game.cities.length; i++) {
    game.cities[i].draw();
  }
};

const renderTurret = (game) => {
  game.turret.draw();
};

const renderDefensiveMissiles = (game) => {
  for (let i = 0; i < game.missiles.length; i++) {
    game.missiles[i].draw();
  }
};

const renderEnemyMissiles = (game) => {
  for (let i = 0; i < game.enemyMissiles.length; i++) {
    game.enemyMissiles[i].draw();
  }
};

const renderExplosions = (game) => {
  for (let i = 0; i < game.explosions.length; i++) {
    game.explosions[i].draw();
  }
};

const renderDebugger = (game) => {
  game.ctx.fillStyle = game.textColor;
  game.ctx.font = `${game.uiFontSize}px Monospace`;
  game.ctx.fillText(`dificulty: ${game.dificulty}`, 30, 70);
};

const renderGameOver = (game) => {
  game.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

  game.ctx.fillStyle = '#fff';
  game.ctx.font = `${game.uiFontSize * 1.5}px Monospace`;
  game.ctx.textAlign = 'center';
  game.ctx.fillText('GAME OVER', game.canvas.width / 2, game.canvas.height / 2 - 40);

  game.ctx.font = `${game.uiFontSize}px Monospace`;
  game.ctx.fillText(`Pontuação final: ${game.score}`, game.canvas.width / 2, game.canvas.height / 2 + 10);

  game.ctx.font = `${game.uiFontSize * 0.85}px Monospace`;
  game.ctx.fillText('Clique para jogar novamente', game.canvas.width / 2, game.canvas.height / 2 + 50);

  game.ctx.textAlign = 'left';
};