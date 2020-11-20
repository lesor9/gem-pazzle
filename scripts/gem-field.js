import Settings from './settings.js';
export { makechain, autoSolver, autoSolverMode };

var history;

function shuffle(arr, N) {
    const step = N;
    const numOfAllPuzzles = Math.pow(N, 2);
    const directions = ['up', 'right', 'down', 'left'];
    const shuffleHistory = [];
    let lastMove;

    for (let i = 0; i < Math.pow(N, 3); i++) {
        const indexOfBlank = arr.indexOf(0);
        
        const possibleMoves = {
            up: true,
            right: true,
            down: true,
            left: true,
        };

        //check if elem is on top or bottom layer
        if (indexOfBlank < N) {
            possibleMoves.up = false;
        } else if (indexOfBlank > numOfAllPuzzles - N) {
            possibleMoves.down = false;
        }

        //check if elem is on left or right part
        if (indexOfBlank === 0 || (indexOfBlank - 1) % N === 0) {
            possibleMoves.left = false;
        } else if ( (indexOfBlank + 1) % N === 0) {
            possibleMoves.right = false;
        }

        if (lastMove) {
            possibleMoves[lastMove] = false;
        }

        do {
            var dir = directions[Math.floor(Math.random() * 4)];
        } while (possibleMoves[dir] !== true);
             

        switch (dir) {
            case 'up':
                arr[indexOfBlank] = arr[indexOfBlank - step];
                arr[indexOfBlank - step] = 0;
                lastMove = 'down';
                break;
            case 'right':
                arr[indexOfBlank] = arr[indexOfBlank + 1];
                arr[indexOfBlank + 1] = 0;
                lastMove = 'left';
                break;
            case 'down':
                arr[indexOfBlank] = arr[indexOfBlank + step];
                arr[indexOfBlank + step] = 0;
                lastMove = 'up';
                break;
            case 'left':
                arr[indexOfBlank] = arr[indexOfBlank - 1];
                arr[indexOfBlank - 1] = 0;
                lastMove = 'right';
                break;
        }

        shuffleHistory.push(arr[indexOfBlank]);
    }
    
    return shuffleHistory;
}

async function makechain (N = 4) {
    await createField(N);
    setTimeout(() => {
        Settings.properties.isAnimation = false;
    }, 300);
}

async function createField (N) {
    Settings.properties.solverMode = false;
    Settings.properties.isAnimation = true;
    Settings.properties.sec = 0;
    Settings.properties.min = 0;
    const time = document.querySelector('.time');
    time.innerHTML = `Прошло времени: 0s`;

    let numberOfAllPazzles = N * N;

    const numsArr = [];
    for (let i = 1; i < numberOfAllPazzles; i++) {
        numsArr.push(i);
    }
    numsArr.push(0);
    history = shuffle(numsArr, N);

    let mainField = document.createElement('div');
    mainField.classList.add("game-board");
    document.body.appendChild(mainField); 

    adaptiveForField(mainField, N);
    
     
    let numOfImage = Math.floor(Math.random() * (151 - 1)) + 1;

    console.log(numsArr);

    for (let i = 0; i < numberOfAllPazzles; i++) {
        const puzzle = document.createElement('div');
        mainField.appendChild(puzzle);

        if (numsArr[i] === 0) continue;

        puzzle.innerHTML = numsArr[i];
        puzzle.classList.add("puzzle");

        let puzzleNum = Number(puzzle.innerHTML);

        let indexInRow = puzzleNum / N;
        if (indexInRow !== Math.floor(indexInRow)) {
            indexInRow = Math.floor(indexInRow) + 1;
        }

        let indexInColumn = puzzleNum % N;;
        if (puzzleNum < N) {
            indexInColumn = puzzleNum;
        } else if (indexInColumn === 0) {
            indexInColumn = N;
        }

        let koefCol;
        switch (indexInColumn) {
            case 1:
                koefCol = 0;
                break;
            case N:
                koefCol = 1;
                break;
            default:
                koefCol = (indexInColumn - 1) / (N - 1);
                break;
        }

        let koefRow;
        switch (indexInRow) {
            case 1:
                koefRow = 0;
                break;
            case N:
                koefRow = 1;
                break;
            default:
                koefRow = (indexInRow - 1) / (N - 1);
                break;
        }

        let fir = 100 * koefCol;
        let sec = 100 * koefRow;

        puzzle.style.setProperty('background', `no-repeat url(./assets/images/${numOfImage}.jpg) ${fir}% ${sec}% / ${N * 100}%`);


        puzzle.style.setProperty('opacity', `0`); 
        puzzle.style.setProperty('left', `100px`); 
        puzzle.style.setProperty('top', `100px`); 
        await new Promise(r => setTimeout(r, 100));
        puzzle.style.removeProperty('opacity'); 
        puzzle.style.removeProperty('left'); 
        puzzle.style.removeProperty('top');


        let isMoved = false;
        puzzle.addEventListener('click', () => {
            if (isMoved) {
                isMoved = false;
                return;
            }
            
            if (!Settings.properties.solverMode) {
                history.push(puzzleNum);
            }

            if (Settings.properties.volume) {
                new Audio("./assets/sounds/click_on_puzzle.mp3").play();
            }
            
            let stepNumber = document.querySelector('.step');
            stepNumber.innerHTML = Number(stepNumber.innerHTML) + 1;

            i = index(puzzle) + 1;

            let rightElem;
            if ( (i) % N === 0) {
                rightElem = null;
            } else {
                rightElem = mainField.children[i];
            }

            let leftElem;
            if ( (i + N - 1) % N === 0) {
                leftElem = null;
            } else {
                leftElem = mainField.children[i - 2];
            }

            let topElem;
            if ( i <= N ) {
                topElem = null;
            } else {
                topElem = mainField.children[i - (N + 1)];
            }

            let bottomElem;
            if ( i >= numberOfAllPazzles - N + 1) {
                bottomElem = null;
            } else {
                bottomElem = mainField.children[i + (N - 1)];
            }
            
            if (rightElem !== null) {
                if (rightElem.innerHTML === "") { 
                    puzzle.classList.toggle("right");
                    setTimeout(() => {
                        mainField.removeChild(puzzle);
                        mainField.insertBefore(puzzle, mainField.children[i]);
                        puzzle.classList.toggle("right");
                    }, 300);
                }  
            }

            if (leftElem !== null) {
                if (leftElem.innerHTML === "") { 
                    puzzle.classList.toggle("left");
                    setTimeout(() => {
                        mainField.removeChild(puzzle);
                        mainField.insertBefore(puzzle, mainField.children[i - 2]);
                        puzzle.classList.toggle("left");
                    }, 300);
                }  
            }

            
            if (topElem !== null) {
                if (topElem.innerHTML === "") { 
                    puzzle.classList.toggle("top");
                    setTimeout(() => {
                        mainField.removeChild(puzzle);
                        mainField.insertBefore(puzzle, mainField.children[i - (N + 1)]);
                        mainField.removeChild(topElem);
                        mainField.insertBefore(topElem, mainField.children[i - 1]);
                        puzzle.classList.toggle("top");
                    }, 300);
                }  
            }

            if (bottomElem !== null) {
                if (bottomElem.innerHTML === "") { 
                    puzzle.classList.toggle("bottom");
                    setTimeout(() => {
                        mainField.removeChild(puzzle);
                        mainField.insertBefore(puzzle, mainField.children[i + (N - 1)]);
                        mainField.removeChild(bottomElem);
                        mainField.insertBefore(bottomElem, mainField.children[i - 1]);
                        puzzle.classList.toggle("bottom");
                    }, 300);
                }  
            }

            setTimeout(() => {
                isFinished(numberOfAllPazzles);
            }, 400);
        });

        puzzle.onmousedown = function(event) {
            let X = event.clientX;
            let Y = event.clientY;

            document.addEventListener('mousemove', onMouseMove);
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
                isMoved = true;
            }

            function moveAt(pageX, pageY) {
                event.preventDefault();
                puzzle.classList.add("puzzle-drag");
                puzzle.style.setProperty('z-index', '1000');
                puzzle.style.setProperty('left', `${pageX - X}px`);
                puzzle.style.setProperty('top', `${pageY - Y}px`);
            }


            puzzle.onmouseup = function(event) {
                puzzle.classList.remove("puzzle-drag");
                document.removeEventListener('mousemove', onMouseMove);
                puzzle.onmouseup = null; 
                
                let isPuzzleMoved = X != event.clientX || Y != event.clientY;

                if (isPuzzleMoved) {
                    puzzle.hidden = true;
                    let temp = document.createElement('div');
                    mainField.insertBefore(temp, puzzle);
                    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                    puzzle.hidden = false;
                    mainField.removeChild(temp);

                    puzzle.style.removeProperty('zIndex');
                    puzzle.style.removeProperty('left');
                    puzzle.style.removeProperty('top');

                    if (elemBelow.innerHTML === "") {
                        puzzle.click(); 
                    }
                }
            }
        }

    
        
    }
}

function autoSolverMode () {
    Settings.properties.solverMode = true;
}

function autoSolver () {
    if (Settings.properties.isAnimation) return; 
    let mainField = document.querySelector('.game-board');
    let numberOfAllPazzles = mainField.children.length;
    let solverBtn = document.querySelector('.solver');
    solverBtn.disabled = true;
    
    for (let j = 0; j < numberOfAllPazzles; j++) {
        if (mainField.children[j].innerHTML == history[history.length - 1]) {
            history.pop();
            mainField.children[j].click();
            break;
        }
    }

    solverBtn.innerHTML = history.length;
    
    console.log(Settings.properties.solverMode);

    if (history.length != 0 && Settings.properties.solverMode === true) {
        setTimeout(autoSolver, 300);
    } else {
        solverBtn.innerHTML = 'Auto Solver';
        Settings.properties.solverMode = false;
        solverBtn.disabled = false;
    }
}

function index(el) {
    let children = el.parentNode.childNodes,
        i = 0;
    for (; i < children.length; i++) {
        if (children[i] == el) {
            return i;
        }
    }
    return -1;
}

function isFinished(N) {
    let field = document.querySelector(`.game-board`).children;
    const elems = [],
          finishedArr = [];

    for (let i = 0; i < N; i++) {
        finishedArr.push(i + 1);
        elems.push(Number(field[i].innerHTML));
    }
    finishedArr.pop();
    finishedArr.push(0);
    
    let isFinish = true; 
    for (let i = 0; i < N; i++) {
        if (elems[i] !== finishedArr[i]) {
            isFinish = false;
            break;
        }
    }

    if (isFinish) {
        let stepNumber = document.querySelector('.step');
        alert(`Ура! Вы решили головоломку за ${Settings.properties.min ? `${Settings.properties.min}m ${Settings.properties.sec}s`: `${Settings.properties.sec}s`} и ${stepNumber.innerHTML} ходов`);
    }
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


function puzzleAndFieldSizes (width, N, mainField) {
    document.documentElement.style.setProperty('--pazzleSize', `${( width - (5 * (N - 1) ) ) / N}px`);
    document.documentElement.style.setProperty('--pazzleMove', `${( ( width - (5 * (N - 1) ) ) / N ) + 4}px`); 
    document.documentElement.style.setProperty('--pazzleMoveMinus', `${-( ( ( width - (5 * (N - 1) ) ) / N ) + 4)}px`); 
    document.documentElement.style.setProperty('--pazzleFont', `${( ( width - (5 * (N - 1) ) ) / N ) / 2}px`);
    mainField.style.cssText = `grid-template-columns: repeat(${N}, 1fr); grid-template-rows: repeat(${N}, ${width/N}px);`;
}

function adaptiveForField (mainField, N) {
    if (document.documentElement.clientWidth < 600) {
        puzzleAndFieldSizes (300, N, mainField);
    } else {
        puzzleAndFieldSizes (420, N, mainField);
    }

    window.onresize = function(e) {
        let width = e.srcElement.innerWidth;
        if (width < 600) {
            puzzleAndFieldSizes(300, N, mainField);
        } else {
            puzzleAndFieldSizes(420, N, mainField);
        }
    };
}