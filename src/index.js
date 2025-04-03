import './styles.css';
import Game from './classes/Game';
import Config from './classes/Config';

// Elementos DOM
const domEl = {
  settingsScreen: document.getElementById('settings-screen'),
  startButton: document.getElementById('start-game'),
  playerNameInput: document.getElementById('player-name'),
  resolutionSelect: document.getElementById('resolution'),
  gameContainer: document.getElementById('game-container'),
  canvas: document.getElementById('game-canvas')
};

function initializeGame(config) {
  const {width, height} = config.getResolution();
  const htmlEl = document.getElementsByTagName('html')[0];
  htmlEl.style.minWidth = `${width}px`;
  htmlEl.style.minHeight = `${height}px`;
  domEl.canvas.width = width;
  domEl.canvas.height = height;

  config.toggleCanvasVisibility(true);

  const gameObj = new Game(domEl.canvas, config.settings);
  gameObj.start();

}

function setupSettingsScreen(config) {
  // Preenche os campos com as configurações salvas
  domEl.playerNameInput.value = config.settings.playerName.trim();
  domEl.resolutionSelect.value = config.settings.resolutionIndex;

  domEl.startButton.addEventListener('click', () => {
    const newSettings = {
      playerName: domEl.playerNameInput.value.trim(),
      resolutionIndex: domEl.resolutionSelect.value
    };

    const validation = config.validate(newSettings.playerName);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    config.saveSettings(newSettings);
    domEl.settingsScreen.style.display = 'none';
    initializeGame(config);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const gameConfig = new Config();
  setupSettingsScreen(gameConfig);
});
