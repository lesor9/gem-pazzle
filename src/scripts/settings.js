import '../css/style.css';

import {
  makechain, autoSolver, bestResult, savedGame, lastGame,
} from './gem-field.js';

const Settings = {
  init() {
    this.createHr();
    this.createMainDiv();
    this.createSelectMenu();
    this.createVolumeBtn();
    this.autoSolverBtn();
    this.createNewGameBtn();
    this.bestResults();
    this.saveGame();
    this.createStepsAndTime();
    this.createHr();
  },

  properties: {
    volume: true,
    isAnimation: true,
    sec: 0,
    min: 0,
    solverMode: false,
    solverModeHardOff: false,
    stepNumber: document.createElement('span'),
    saveMode: false,
  },

  settingsField: document.createElement('div'),
  selectAndVolumeField: document.createElement('div'),

  createHr() {
    document.body.appendChild(document.createElement('hr')).classList.add('line');
  },

  createMainDiv() {
    this.settingsField.classList.add('settings');
    document.body.appendChild(this.settingsField);
  },

  createSelectMenu() {
    const select = document.createElement('select');
    select.classList.add('select');
    select.addEventListener('change', this.selecteChanged);
    this.selectAndVolumeField.appendChild(select);

    for (let i = 3; i <= 8; i += 1) {
      const option = document.createElement('option');
      if (i === 4) {
        option.setAttribute('selected', 'selected');
      }
      option.innerHTML = `${i}x${i}`;
      select.appendChild(option);
    }
  },

  selecteChanged() {
    const sel = this.selectedIndex + 3;
    Settings.properties.stepNumber.innerHTML = 0;

    document.body.removeChild(document.querySelector('.game-board'));
    makechain(sel);
  },

  createVolumeBtn() {
    const volumeBtn = document.createElement('div');
    volumeBtn.innerHTML = '<i class="material-icons">volume_up</i>';
    volumeBtn.classList.add('volume');
    volumeBtn.addEventListener('click', () => {
      if (this.properties.volume) {
        volumeBtn.innerHTML = '<i class="material-icons">volume_off</i>';
        this.properties.volume = false;
      } else if (!this.properties.volume) {
        volumeBtn.innerHTML = '<i class="material-icons">volume_up</i>';
        this.properties.volume = true;
      }
    });

    this.selectAndVolumeField.appendChild(volumeBtn);
    this.selectAndVolumeField.classList.add('sel-vol');
    this.settingsField.appendChild(this.selectAndVolumeField);
  },

  createNewGameBtn() {
    const select = document.querySelector('.select');
    const newGameBtn = document.createElement('button');
    newGameBtn.innerHTML = 'New Game';
    newGameBtn.classList.add('new-game');
    newGameBtn.classList.add('button');
    newGameBtn.addEventListener('click', () => {
      const sel = select.selectedIndex + 3;
      this.properties.stepNumber.innerHTML = 0;
      document.body.removeChild(document.querySelector('.game-board'));
      makechain(sel);
    });

    this.settingsField.appendChild(newGameBtn);
  },

  autoSolverBtn() {
    const autoSolverBtn = document.createElement('button');
    autoSolverBtn.classList.add('solver');
    autoSolverBtn.classList.add('button');
    autoSolverBtn.innerHTML = 'Auto Solver';

    autoSolverBtn.addEventListener('click', autoSolver);

    this.settingsField.appendChild(autoSolverBtn);
  },

  bestResults() {
    const resultsBtn = document.createElement('button');
    resultsBtn.innerHTML = 'Best';
    resultsBtn.classList.add('button');
    resultsBtn.addEventListener('click', bestResult);

    this.settingsField.appendChild(resultsBtn);
  },

  saveGame() {
    const saveBtnss = document.createElement('div');
    saveBtnss.classList.add('save-btns');

    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = 'Save';

    saveBtn.classList.add('save-button');
    saveBtn.addEventListener('click', savedGame);

    const loadBtn = document.createElement('button');
    loadBtn.classList.add('save-button');
    loadBtn.innerHTML = 'Last game';
    loadBtn.addEventListener('click', lastGame);

    saveBtnss.appendChild(saveBtn);
    saveBtnss.appendChild(loadBtn);
    this.settingsField.appendChild(saveBtnss);
  },

  createStepsAndTime() {
    const stepsAndTime = document.createElement('div');
    stepsAndTime.classList.add('stepsAndTime');

    const steps = document.createElement('div');
    steps.classList.add('steps');
    steps.innerHTML = 'Ходов: ';
    this.properties.stepNumber.classList.add('step');
    this.properties.stepNumber.innerHTML = 0;
    steps.appendChild(this.properties.stepNumber);
    stepsAndTime.appendChild(steps);

    const time = document.createElement('div');
    time.classList.add('time');
    time.innerHTML = this.properties.min ? `${this.properties.min}m ${this.properties.sec}s` : `${this.properties.sec}s`;

    setInterval(() => {
      if (!this.properties.isAnimation) {
        this.properties.sec += 1;
        if (this.properties.sec >= 60) {
          this.properties.min += 1;
          this.properties.sec -= 60;
        }
      }

      time.innerHTML = this.properties.min ? `${this.properties.min}m ${this.properties.sec}s` : `${this.properties.sec}s`;
    }, 1000);
    stepsAndTime.appendChild(time);

    this.settingsField.appendChild(stepsAndTime);
  },
};

Settings.init();
export default Settings;

makechain();
