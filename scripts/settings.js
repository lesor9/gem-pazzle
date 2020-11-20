import { makechain, autoSolver, autoSolverMode } from './gem-field.js';

const Settings = {
    init () {
        this._createHr();
        this._createMainDiv();
        this._createSelectMenu();
        this._createVolumeBtn();
        this._createNewGameBtn();
        this._autoSolverBtn();
        this._createStepsAndTime();
        this._createHr();
    },

    properties : {  
        volume: true,
        isAnimation: true,
        sec: 0,
        min: 0,
        solverMode: false,
        stepNumber:  document.createElement('span'),
    },

    settingsField : document.createElement('div'),

    _createHr() {
        document.body.appendChild(document.createElement('hr')).classList.add('line');
    },

    _createMainDiv() {
        this.settingsField.classList.add('settings');
        document.body.appendChild(this.settingsField);
    },

    _createSelectMenu() {
        const select = document.createElement('select');
        select.classList.add('select');
        select.addEventListener('change', this.selecteChanged);
        this.settingsField.appendChild(select);

        for (let i = 3; i <= 8; i++) {
            const option = document.createElement('option');
            if (i === 4) {
                option.setAttribute("selected", "selected");
            } 
            option.innerHTML = `${i}x${i}`;
            select.appendChild(option);
        }
    },

    selecteChanged() {
        let sel = this.selectedIndex + 3;
        Settings.properties.stepNumber.innerHTML = 0;

        console.log(sel);

        document.body.removeChild(document.querySelector('.game-board'));
        makechain(sel);
    },

    _createVolumeBtn () {
        const volumeBtn = document.createElement('div');
        volumeBtn.innerHTML =  '<i class="material-icons">volume_up</i>';
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

        this.settingsField.appendChild(volumeBtn);
    },

    _createNewGameBtn() {
        const select = document.querySelector('.select');
        const newGameBtn = document.createElement(`button`);
        newGameBtn.innerHTML = 'New Game';
        newGameBtn.classList.add('new-game');
        newGameBtn.classList.add('button');
        newGameBtn.addEventListener(`click`, () => {
            let sel = select.selectedIndex + 3;
            console.log(this.properties.stepNumber);
            this.properties.stepNumber.innerHTML = 0;
            document.body.removeChild(document.querySelector('.game-board'));
            makechain(sel);
        });

        this.settingsField.appendChild(newGameBtn);
    },

    _autoSolverBtn() {
        const autoSolverBtn = document.createElement(`button`);
        autoSolverBtn.classList.add('solver');
        autoSolverBtn.classList.add('button');
        autoSolverBtn.innerHTML = 'Auto Solver';

        autoSolverBtn.addEventListener('click', autoSolverMode);
        autoSolverBtn.addEventListener('click', autoSolver);

        this.settingsField.appendChild(autoSolverBtn);
    },

    _createStepsAndTime() {
        const stepsAndTime = document.createElement('div');
        stepsAndTime.classList.add('stepsAndTime');

        const steps = document.createElement('div');
        steps.classList.add('steps');
        steps.innerHTML = "Ходов: ";
        this.properties.stepNumber.classList.add('step');
        this.properties.stepNumber.innerHTML = 0;
        steps.appendChild(this.properties.stepNumber);
        stepsAndTime.appendChild(steps);
        
        const time = document.createElement('div');
        time.classList.add('time');
        time.innerHTML = this.properties.min ? `Прошло времени: ${this.properties.min}m ${this.properties.sec}s`: `Прошло времени: ${this.properties.sec}s`;
        
        setInterval(() => {
            if (!this.properties.isAnimation) {
                this.properties.sec++;
                if (this.properties.sec >= 60) {
                    this.properties.min++;
                    this.properties.sec = this.properties.sec - 60;
                }
            }
            
            time.innerHTML = this.properties.min ? `Прошло времени: ${this.properties.min}m ${this.properties.sec}s`: `Прошло времени: ${this.properties.sec}s`;
        }, 1000);
        stepsAndTime.appendChild(time);

        this.settingsField.appendChild(stepsAndTime);
    }
}

Settings.init();
export default Settings;

makechain();