let mainField = document.createElement('div');
mainField.style.cssText = "grid-template-columns: repeat(3, 1fr); grid-auto-rows: 140px;";
mainField.classList.add("game-board");
document.body.appendChild(mainField);

let emptyCell = Math.floor(Math.random() * 9) + 1;
console.log(emptyCell);

for (let i = 1; i <= 9; i++) {

    const puzzle = document.createElement('div');
    mainField.appendChild(puzzle);

    if (i === emptyCell) continue;

    puzzle.innerHTML = i;
    puzzle.classList.add("puzzle");

    puzzle.addEventListener('click', () => {
        console.log(mainField.children[i - 1]);

        let leftElem = mainField.children[i - 2]
        if (leftElem.innerHTML === "") { 
            
        } 

        puzzle.style.cssText = "color: blue;";
    });
}