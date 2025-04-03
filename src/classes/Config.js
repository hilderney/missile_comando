export default class Config {
  constructor() {
    this.defaultSettings = {
      playerId: '',
      playerName: '',
      playerHighScore: '',
      resolutionIndex: '1',
      defaultWidth: '320',
      defaultHeight: '160',
      resolution: '320x160',
    };

    this.settings = this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('gameSettings');
    return savedSettings
      ? { ...this.defaultSettings, ...JSON.parse(savedSettings) }
      : this.defaultSettings;
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    return this.settings;
  }

  getResolution() {
    const resolutionIndex = this.settings.resolutionIndex;
    this.defaultSettings.resolutionIndex = resolutionIndex;
    const width = this.defaultSettings.defaultWidth * this.defaultSettings.resolutionIndex;
    const height = this.defaultSettings.defaultHeight * this.defaultSettings.resolutionIndex;
    this.defaultSettings.resolution = `${width}x${height}`;
    return { width, height };
  }

  validate(playerName) {
    const errors = [];
    if (!playerName.trim()) errors.push('Nome do jogador é obrigatório');
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toggleCanvasVisibility(show = true) {
    const gameContainer = document.getElementById('game-container');
    const settingsScreen = document.getElementById('settings-screen');

    settingsScreen.style.display = !show ? 'block' : 'none';
    gameContainer.style.display = show ? 'block' : 'none';
  }
}