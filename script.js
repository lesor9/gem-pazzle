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
    createField(sel);
}


const steps = document.createElement('div');
steps.classList.add('steps');
steps.innerHTML = "Ходов: ";
stepNumber = document.createElement('span');
stepNumber.innerHTML = 0;
steps.appendChild(stepNumber);
settings.appendChild(steps);

document.body.appendChild(document.createElement('hr')).classList.add('line');



createField();
function createField (N = 3) {
    numberOfAllPazzles = N * N;

    document.documentElement.style.setProperty('--pazzleSize', `${( 420 - (5 * (N - 1) ) ) / N}px`);
    document.documentElement.style.setProperty('--pazzleMove', `${( ( 420 - (5 * (N - 1) ) ) / N ) + 5}px`); 
    document.documentElement.style.setProperty('--pazzleMoveMinus', `${-( ( ( 420 - (5 * (N - 1) ) ) / N ) + 5 )}px`); 

    let mainField = document.createElement('div');
    mainField.style.cssText = `grid-template-columns: repeat(${N}, 1fr); grid-auto-rows: ${420 / N}px;`;
    mainField.classList.add("game-board");
    document.body.appendChild(mainField);

    let emptyCell = Math.floor(Math.random() * numberOfAllPazzles) + 1;
    console.log(`Пустая: ${emptyCell}`);

    let myNewSet = new Set();
    while ([...myNewSet].length != numberOfAllPazzles - 1) {
        myNewSet.add(Math.floor(Math.random() * (numberOfAllPazzles - 1)) + 1);
    }
    
    const arrayElems = [...myNewSet];

    for (let i = 1; i <= numberOfAllPazzles; i++) {

        const puzzle = document.createElement('div');
        mainField.appendChild(puzzle);

        if (i === emptyCell) continue;

        puzzle.innerHTML = arrayElems[i - 1];
        if (arrayElems[i - 1] === undefined) puzzle.innerHTML = arrayElems[emptyCell - 1];
        puzzle.classList.add("puzzle");

        let isMoved = false;
        puzzle.addEventListener('click', (e) => {
            if (isMoved) {
                isMoved = false;
                return;
            }

            stepNumber.innerHTML = Number(stepNumber.innerHTML) + 1;

            console.log(`Кликнул на ${puzzle.innerHTML}`);

            i = index(puzzle) + 1;
            console.log(`Номер элемента: ${i}`);

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
            }, 300);
            
            console.log('============');
        });

        puzzle.onmousedown = function(event) {
            let X = event.clientX;
            let Y = event.clientY;

            let copyOfNodeCSS = puzzle.style.cssText;

            document.addEventListener('mousemove', onMouseMove);
            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
                isMoved = true;
            }

            function moveAt(pageX, pageY) {
                event.preventDefault();
                puzzle.classList.add("puzzle-drag");
                puzzle.style.zIndex = 1000;
                puzzle.style.left = pageX - X + 'px';
                puzzle.style.top = pageY - Y + 'px';
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
                    mainField.removeChild(temp);
                    puzzle.hidden = false;
                    puzzle.style.cssText = copyOfNodeCSS;

                    if (elemBelow.innerHTML === "") {
                        puzzle.click();
                    }
                }
            }
        }

        
    }
}



function index(el) {
    var children = el.parentNode.childNodes,
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
        alert("Вы прошли!!!!");
    }
};