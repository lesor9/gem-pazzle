let mainField = document.createElement('div');
mainField.style.cssText = "grid-template-columns: repeat(3, 1fr); grid-auto-rows: 140px;";
mainField.classList.add("game-board");
document.body.appendChild(mainField);

let emptyCell = Math.floor(Math.random() * 9) + 1;
console.log(`Пустая: ${emptyCell}`);

for (let i = 1; i <= 9; i++) {

    const puzzle = document.createElement('div');
    mainField.appendChild(puzzle);

    if (i === emptyCell) continue;

    puzzle.innerHTML = i;
    puzzle.classList.add("puzzle");

    let isMoved = false;
    puzzle.addEventListener('click', (e) => {
        if (isMoved) {
            isMoved = false;
            return;
        }

        console.log(`Кликнул на ${puzzle.innerHTML}`);

        i = index(puzzle) + 1;
        console.log(`Номер элемента: ${i}`);

        let rightElem;
        if ( (i) % 3 === 0) {
            rightElem = null;
        } else {
            rightElem = mainField.children[i];
        }

        let leftElem;
        if ( (i + 2) % 3 === 0) {
            leftElem = null;
        } else {
            leftElem = mainField.children[i - 2];
        }

        let topElem;
        if ( i <= 3 ) {
            topElem = null;
        } else {
            topElem = mainField.children[i - 4];
        }

        let bottomElem;
        if ( i >= 7 ) {
            bottomElem = null;
        } else {
            bottomElem = mainField.children[i + 2];
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
                    mainField.insertBefore(puzzle, mainField.children[i - 4]);
                    const emptyCell = mainField.children[i - 3];
                    mainField.removeChild(emptyCell);
                    mainField.insertBefore(emptyCell, mainField.children[i - 1]);
                    puzzle.classList.toggle("top");
                }, 300);
            }  
        }

        if (bottomElem !== null) {
            if (bottomElem.innerHTML === "") { 
                puzzle.classList.toggle("bottom");
                setTimeout(() => {
                    mainField.removeChild(puzzle);
                    mainField.insertBefore(puzzle, mainField.children[i + 2]);
                    const emptyCell = mainField.children[i + 1];
                    mainField.removeChild(emptyCell);
                    mainField.insertBefore(emptyCell, mainField.children[i - 1]);
                    puzzle.classList.toggle("bottom");
                }, 300);
            }  
        }

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