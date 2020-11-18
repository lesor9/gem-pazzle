document.body.appendChild(document.createElement('hr')).classList.add('line');

const settings = document.createElement('div');
settings.classList.add('settings');
document.body.appendChild(settings);

const select = document.createElement('select');
select.classList.add('select');
select.setAttribute('onchange', 'selecteChanged()');
settings.appendChild(select);

for (let i = 3; i <= 8; i++) {
    const option = document.createElement('option');
    if (i === 4) {
        option.setAttribute("selected", "selected");
    } 
    option.innerHTML = `${i}x${i}`;
    select.appendChild(option);
}

function selecteChanged() {
    let sel = select.selectedIndex + 3;
    stepNumber.innerHTML = 0;
    document.body.removeChild(document.querySelector('.game-board'));
    makeChain(sel);
}

const newGameBtn = document.createElement(`button`);
newGameBtn.innerHTML = 'New Game';
newGameBtn.classList.add('new-game');
newGameBtn.addEventListener(`click`, () => {
    let sel = select.selectedIndex + 3;
    stepNumber.innerHTML = 0;
    document.body.removeChild(document.querySelector('.game-board'));
    makeChain(sel);
});
settings.appendChild(newGameBtn);

const stepsAndTime = document.createElement('div');
stepsAndTime.classList.add('stepsAndTime');

const steps = document.createElement('div');
steps.classList.add('steps');
steps.innerHTML = "Ходов: ";
stepNumber = document.createElement('span');
stepNumber.innerHTML = 0;
steps.appendChild(stepNumber);
stepsAndTime.appendChild(steps);

const time = document.createElement('div');
let sec = 0,
    min = 0;

let isAnimation = true;
setInterval(() => {
    if (!isAnimation) {
        sec++;
        if (sec >= 60) {
            min++;
            sec = sec - 60;
        }
        time.innerHTML = min ? `Прошло времени: ${min}m ${sec}s`: `Прошло времени: ${sec}s`;
    }
    
}, 1000);
stepsAndTime.appendChild(time);

settings.appendChild(stepsAndTime);

document.body.appendChild(document.createElement('hr')).classList.add('line');

makeChain ();
async function makeChain (N = 4) {
    isAnimation = true;
    numberOfAllPazzles = N * N;

    let emptyCell = Math.floor(Math.random() * numberOfAllPazzles) + 1;

    let myNewSet = new Set();
    while ([...myNewSet].length != numberOfAllPazzles - 1) {
        myNewSet.add(Math.floor(Math.random() * (numberOfAllPazzles - 1)) + 1);
    }
    
    const arrayElems = [...myNewSet];

    if( (isSolveable(arrayElems.valueOf(), emptyCell)) ) {
        time.innerHTML = `Прошло времени: 0s`;
        sec = 0;
        min = 0;
        await createField(emptyCell, arrayElems, N);
        setTimeout(() => {
            isAnimation = false;
        }, 300);
        return;
    }
    
    makeChain(N);
}

async function createField (emptyCell, arrayElems, N) {
    document.documentElement.style.setProperty('--pazzleSize', `${( 420 - (5 * (N - 1) ) ) / N}px`);
    document.documentElement.style.setProperty('--pazzleMove', `${( ( 420 - (5 * (N - 1) ) ) / N ) + 5}px`); 
    document.documentElement.style.setProperty('--pazzleMoveMinus', `${-( ( ( 420 - (5 * (N - 1) ) ) / N ) + 5 )}px`); 
    document.documentElement.style.setProperty('--pazzleFont', `${( ( 420 - (5 * (N - 1) ) ) / N ) / 2}px`);

    let mainField = document.createElement('div');
    mainField.style.cssText = `grid-template-columns: repeat(${N}, 1fr); grid-template-rows: repeat(${N}, ${420/N}px);`;
    mainField.classList.add("game-board");
    document.body.appendChild(mainField);  
    
    numOfImage = Math.floor(Math.random() * (151 - 1)) + 1;

    for (let i = 1; i <= numberOfAllPazzles; i++) {
        const puzzle = document.createElement('div');
        mainField.appendChild(puzzle);

        if (i === emptyCell) continue;

        puzzle.innerHTML = arrayElems[i - 1];
        if (arrayElems[i - 1] === undefined) puzzle.innerHTML = arrayElems[emptyCell - 1];
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

            new Audio("./assets/sounds/click_on_puzzle.mp3").play();
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
                    temp = document.createElement('div');
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
        alert(`Ура! Вы решили головоломку за ${min ? `${min}m ${sec}s`: `${sec}s`} и ${stepNumber.innerHTML} ходов`);
    }
};



//https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
function isSolveable (array, empt) {
    const copyOfInitialArray = [];
    for (let i = 0; i < array.length; i++) {
        copyOfInitialArray.push(array[i]);
    }

    if (empt - 1 !== copyOfInitialArray.length) {
        let k = copyOfInitialArray[empt - 1];
        copyOfInitialArray[empt - 1] = 0;
        copyOfInitialArray.push(k);
    } else copyOfInitialArray.push(0);

    let inversions = 0;
    for (let i = 0; i < copyOfInitialArray.length; i++) {
        for  (let j = i + 1; j < copyOfInitialArray.length; j++) {
            if ( (copyOfInitialArray[i] > copyOfInitialArray[j]) && (j > i) && copyOfInitialArray[j] != 0) {
                inversions++;
            }
        }
    }

    newArr = [];
    let gridWidth = Math.sqrt(copyOfInitialArray.length);
    for (let i = 0; i < copyOfInitialArray.length; i+=gridWidth) {
        newArr.push(copyOfInitialArray.slice(i, i + gridWidth));
    }

    let row = Math.floor(newArr.reverse().flat().indexOf(0) / gridWidth) + 1;
    let isRowEven = row % 2 === 0;

    if ( (gridWidth % 2) !== 0 && (inversions % 2) === 0 ) {
        return true;
    }

    if ( (gridWidth % 2) === 0 && (inversions % 2) !== 0 && isRowEven) {
        return true;
    }

    if ( (gridWidth % 2) === 0 && (inversions % 2) === 0 && !isRowEven) {
        return true;
    }

    return false;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }