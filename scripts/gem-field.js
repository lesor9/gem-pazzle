import Settings from './settings.js';

let history;

function shuffle(arr, N) {
  const step = N;
  const numOfAllPuzzles = N ** 2;
  const directions = ['up', 'right', 'down', 'left'];
  const shuffleHistory = [];
  let lastMove;

  for (let i = 0; i < N ** 3; i += 1) {
    const indexOfBlank = arr.indexOf(0);

    const possibleMoves = {
      up: true,
      right: true,
      down: true,
      left: true,
    };

    // check if elem is on top or bottom layer
    if (indexOfBlank < N) {
      possibleMoves.up = false;
    } else if (indexOfBlank > numOfAllPuzzles - N) {
      possibleMoves.down = false;
    }

    // check if elem is on left or right part
    if (indexOfBlank === 0 || (indexOfBlank - 1) % N === 0) {
      possibleMoves.left = false;
    } else if ((indexOfBlank + 1) % N === 0) {
      possibleMoves.right = false;
    }

    if (lastMove) {
      possibleMoves[lastMove] = false;
    }

    let dir;
    do {
      dir = directions[Math.floor(Math.random() * 4)];
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
      default:
        return null;
    }

    shuffleHistory.push(arr[indexOfBlank]);
  }

  return shuffleHistory;
}

function isFinished(N, numOfImage) {
  const field = document.querySelector('.game-board').children;
  const stepNumber = document.querySelector('.step');
  const elems = [];
  const finishedArr = [];

  for (let i = 0; i < N; i += 1) {
    finishedArr.push(i + 1);
    elems.push(Number(field[i].innerHTML));
  }
  finishedArr.pop();
  finishedArr.push(0);

  for (let i = 0; i < N; i += 1) {
    if (elems[i] !== finishedArr[i]) {
      return;
    }
  }

  const tableName = document.createElement('caption');
  tableName.classList.add('result-table__table-name');
  const { options } = document.querySelector('.select');
  const sel = document.querySelector('.select').selectedIndex;

  let recrd = localStorage.getItem('recrd');

  if (recrd === null) {
    recrd = {};
  } else {
    recrd = JSON.parse(recrd);
  }

  let arr = recrd[options[sel].value];

  if (arr === undefined) {
    arr = [[]];
    arr[0].push(Settings.properties.min);
    arr[0].push(Settings.properties.sec);
    arr[0].push(numOfImage);
  } else {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i][0] >= Settings.properties.min) {
        if (arr[i][1] >= Settings.properties.sec) {
          const temp = [];
          temp.push(Settings.properties.min);
          temp.push(Settings.properties.sec);
          temp.push(numOfImage);
          arr.splice(i, 0, temp);
          break;
        }
      }

      if (i === arr.length - 1) {
        const temp = [];
        temp.push(Settings.properties.min);
        temp.push(Settings.properties.sec);
        temp.push(numOfImage);
        arr.push(temp);
        break;
      }
    }

    while (arr.length > 10) {
      arr.pop();
    }
  }

  recrd[options[sel].value] = arr;
  localStorage.setItem('recrd', JSON.stringify(recrd));

  alert(`Ура! Вы решили головоломку за ${Settings.properties.min ? `${Settings.properties.min}m ${Settings.properties.sec}s` : `${Settings.properties.sec}s`} и ${stepNumber.innerHTML} ходов`);
}

function puzzleAndFieldSizes(width, N, mainField) {
  document.documentElement.style.setProperty('--pazzleSize', `${(width - (5 * (N - 1))) / N}px`);
  document.documentElement.style.setProperty('--pazzleMove', `${((width - (5 * (N - 1))) / N) + 4}px`);
  document.documentElement.style.setProperty('--pazzleMoveMinus', `${-(((width - (5 * (N - 1))) / N) + 4)}px`);
  document.documentElement.style.setProperty('--pazzleFont', `${((width - (5 * (N - 1))) / N) / 2}px`);
  mainField.style.cssText = `grid-template-columns: repeat(${N}, 1fr); grid-template-rows: repeat(${N}, ${width / N}px);`;
}

function adaptiveForField(mainField, N) {
  if (document.documentElement.clientWidth < 600) {
    puzzleAndFieldSizes(300, N, mainField);
  } else {
    puzzleAndFieldSizes(420, N, mainField);
  }

  window.onresize = (e) => {
    const width = e.srcElement.innerWidth;
    if (width < 600) {
      puzzleAndFieldSizes(300, N, mainField);
    } else {
      puzzleAndFieldSizes(420, N, mainField);
    }
  };
}

function index(el) {
  const children = el.parentNode.childNodes;
  let i = 0;
  for (; i < children.length; i += 1) {
    if (children[i] === el) {
      return i;
    }
  }
  return -1;
}

async function createField(N) {
  Settings.properties.solverMode = false;
  Settings.properties.solverModeHardOff = true;
  const solverBtn = document.querySelector('.solver');
  solverBtn.innerHTML = 'Auto Solver';
  solverBtn.disabled = false;
  Settings.properties.isAnimation = true;
  const time = document.querySelector('.time');

  if (Settings.properties.saveMode) {
    [, , , Settings.properties.min] = Settings.properties.game;
    [, , , , Settings.properties.sec] = Settings.properties.game;
    // Settings.properties.min = Settings.properties.game[4];
    // Settings.properties.sec = Settings.properties.game[5];
  } else {
    Settings.properties.sec = 0;
    Settings.properties.min = 0;
    time.innerHTML = '0s';
  }

  let numberOfAllPazzles = N * N;

  if (Settings.properties.saveMode) numberOfAllPazzles = Settings.properties.game[0] ** 2;

  let numsArr = [];
  for (let i = 1; i < numberOfAllPazzles; i += 1) {
    numsArr.push(i);
  }
  numsArr.push(0);
  history = shuffle(numsArr, N);

  const mainField = document.createElement('div');
  mainField.classList.add('game-board');
  document.body.appendChild(mainField);

  adaptiveForField(mainField, N);

  let numOfImage = Math.floor(Math.random() * (151 - 1)) + 1;

  if (Settings.properties.saveMode) {
    numsArr = Settings.properties.game[1];
    history = Settings.properties.game[2];
    numOfImage = Settings.properties.game[6];
    const stepNumber = document.querySelector('.step');
    stepNumber.innerHTML = Settings.properties.game[3];

    time.innerHTML = Settings.properties.min ? `${Settings.properties.min}m ${Settings.properties.sec}s` : `${Settings.properties.sec}s`;

    const { options } = document.querySelector('.select');
    const sel = document.querySelector('.select').selectedIndex;
    options[sel].removeAttribute('selected', 'selected');
    options[N - 3].setAttribute('selected', 'selected');
  }

  for (let i = 0; i < numberOfAllPazzles; i += 1) {
    const puzzle = document.createElement('div');
    mainField.appendChild(puzzle);

    if (Number(numsArr[i]) === 0) continue;

    puzzle.innerHTML = numsArr[i];
    puzzle.classList.add('puzzle');

    const puzzleNum = Number(puzzle.innerHTML);

    let indexInRow = puzzleNum / N;
    if (indexInRow !== Math.floor(indexInRow)) {
      indexInRow = Math.floor(indexInRow) + 1;
    }

    let indexInColumn = puzzleNum % N;
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

    const fir = 100 * koefCol;
    const sec = 100 * koefRow;

    puzzle.style.setProperty('background', `no-repeat url(./assets/images/${numOfImage}.jpg) ${fir}% ${sec}% / ${N * 100}%`);
    Settings.properties.num = numOfImage;

    puzzle.style.setProperty('opacity', '0');
    puzzle.style.setProperty('left', '100px');
    puzzle.style.setProperty('top', '100px');
    await new Promise((r) => setTimeout(r, 100));
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
        new Audio('./assets/sounds/click_on_puzzle.mp3').play();
      }

      const stepNumber = document.querySelector('.step');
      stepNumber.innerHTML = Number(stepNumber.innerHTML) + 1;

      i = index(puzzle) + 1;

      let rightElem;
      if ((i) % N === 0) {
        rightElem = null;
      } else {
        rightElem = mainField.children[i];
      }

      let leftElem;
      if ((i + N - 1) % N === 0) {
        leftElem = null;
      } else {
        leftElem = mainField.children[i - 2];
      }

      let topElem;
      if (i <= N) {
        topElem = null;
      } else {
        topElem = mainField.children[i - (N + 1)];
      }

      let bottomElem;
      if (i >= numberOfAllPazzles - N + 1) {
        bottomElem = null;
      } else {
        bottomElem = mainField.children[i + (N - 1)];
      }

      if (rightElem !== null) {
        if (rightElem.innerHTML === '') {
          puzzle.classList.toggle('right');
          puzzle.style.pointerEvents = 'none';
          setTimeout(() => {
            mainField.removeChild(puzzle);
            mainField.insertBefore(puzzle, mainField.children[i]);
            puzzle.classList.toggle('right');
            puzzle.style.pointerEvents = 'auto';
          }, 300);
        }
      }

      if (leftElem !== null) {
        if (leftElem.innerHTML === '') {
          puzzle.classList.toggle('left');
          puzzle.style.pointerEvents = 'none';
          setTimeout(() => {
            mainField.removeChild(puzzle);
            mainField.insertBefore(puzzle, mainField.children[i - 2]);
            puzzle.classList.toggle('left');
            puzzle.style.pointerEvents = 'auto';
          }, 300);
        }
      }

      if (topElem !== null) {
        if (topElem.innerHTML === '') {
          puzzle.classList.toggle('top');
          puzzle.style.pointerEvents = 'none';
          setTimeout(() => {
            mainField.removeChild(puzzle);
            mainField.insertBefore(puzzle, mainField.children[i - (N + 1)]);
            mainField.removeChild(topElem);
            mainField.insertBefore(topElem, mainField.children[i - 1]);
            puzzle.classList.toggle('top');
            puzzle.style.pointerEvents = 'auto';
          }, 300);
        }
      }

      if (bottomElem !== null) {
        if (bottomElem.innerHTML === '') {
          puzzle.classList.toggle('bottom');
          puzzle.style.pointerEvents = 'none';
          setTimeout(() => {
            mainField.removeChild(puzzle);
            mainField.insertBefore(puzzle, mainField.children[i + (N - 1)]);
            mainField.removeChild(bottomElem);
            mainField.insertBefore(bottomElem, mainField.children[i - 1]);
            puzzle.classList.toggle('bottom');
            puzzle.style.pointerEvents = 'auto';
          }, 300);
        }
      }

      if (!Settings.properties.solverMode) {
        setTimeout(() => {
          isFinished(numberOfAllPazzles, numOfImage);
        }, 400);
      }
    });

    puzzle.onmousedown = (event) => {
      const X = event.clientX;
      const Y = event.clientY;

      function moveAt(pageX, pageY) {
        event.preventDefault();
        puzzle.classList.add('puzzle-drag');
        puzzle.style.setProperty('z-index', '1000');
        puzzle.style.setProperty('left', `${pageX - X}px`);
        puzzle.style.setProperty('top', `${pageY - Y}px`);
      }

      function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
        isMoved = true;
      }
      document.addEventListener('mousemove', onMouseMove);

      puzzle.onmouseup = (e) => {
        puzzle.classList.remove('puzzle-drag');
        document.removeEventListener('mousemove', onMouseMove);
        puzzle.onmouseup = null;

        const isPuzzleMoved = X !== e.clientX || Y !== e.clientY;

        if (isPuzzleMoved) {
          puzzle.hidden = true;
          const temp = document.createElement('div');
          mainField.insertBefore(temp, puzzle);
          const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
          puzzle.hidden = false;
          mainField.removeChild(temp);

          puzzle.style.removeProperty('zIndex');
          puzzle.style.removeProperty('left');
          puzzle.style.removeProperty('top');

          if (elemBelow.innerHTML === '') {
            puzzle.click();
          }
        }
      };
    };
  }

  Settings.properties.saveMode = false;
  Settings.properties.solverModeHardOff = false;
}

async function makechain(N = 4) {
  await createField(N);
  setTimeout(() => {
    Settings.properties.isAnimation = false;
  }, 300);
}

function autoSolver() {
  if (Settings.properties.isAnimation) return;
  const mainField = document.querySelector('.game-board');
  const solverBtn = document.querySelector('.solver');

  Settings.properties.solverMode = true;

  const numberOfAllPazzles = mainField.children.length;

  solverBtn.disabled = true;

  for (let j = 0; j < numberOfAllPazzles; j += 1) {
    if (Number(mainField.children[j].innerHTML) === history[history.length - 1]) {
      history.pop();
      mainField.children[j].click();
      break;
    }
  }

  solverBtn.innerHTML = history.length;

  if (history.length !== 0 && Settings.properties.solverMode === true) {
    setTimeout(autoSolver, 300);
  } else {
    solverBtn.innerHTML = 'Auto Solver';
    Settings.properties.solverMode = false;
    solverBtn.disabled = false;
  }
}

function createTable() {
  const table = document.createElement('table');
  table.classList.add('result-table__table');

  let recrd = localStorage.getItem('recrd');

  const { options } = document.querySelector('.select');
  const sel = document.querySelector('.select').selectedIndex;

  if (recrd === null) {
    table.innerHTML += 'Покуда нет рекордов:)';
    return table;
  }
  recrd = JSON.parse(recrd);

  const arr = recrd[options[sel].value];

  if (arr === undefined) {
    table.innerHTML += 'Покуда нет рекордов:)';
    return table;
  }

  // table caption
  const tableName = document.createElement('caption');
  tableName.classList.add('result-table__table-name');
  tableName.innerHTML = `10 лучших результатов для поля ${options[sel].text}`;
  table.appendChild(tableName);

  // table head
  const head = document.createElement('thead');
  const trHead = document.createElement('tr');

  const th1 = document.createElement('th');
  th1.innerHTML = '№';
  const th2 = document.createElement('th');
  th2.innerHTML = 'Время';
  const th3 = document.createElement('th');
  th3.innerHTML = 'Изображение';

  trHead.appendChild(th1);
  trHead.appendChild(th2);
  trHead.appendChild(th3);

  head.appendChild(trHead);
  table.appendChild(head);

  // table body
  const body = document.createElement('tbody');
  for (let i = 0; i <= arr.length; i += 1) {
    if (arr[i] === undefined) break;

    const tr = document.createElement('tr');

    const tdNumber = document.createElement('td');
    const tdTime = document.createElement('td');
    const tdImg = document.createElement('td');

    tdNumber.innerHTML = i + 1;
    tdTime.innerHTML = `${arr[i][0] ? `${arr[i][0]}m ${arr[i][1]}s` : `${arr[i][1]}s`}`;
    tdImg.innerHTML = `<img src="./assets/images/${arr[i][2]}.jpg" alt="img"></img>`;

    tr.appendChild(tdNumber);
    tr.appendChild(tdTime);
    tr.appendChild(tdImg);

    body.appendChild(tr);
  }
  table.appendChild(body);

  return table;
}

function bestResult() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  overlay.addEventListener('click', (e) => {
    if (e.path[0].classList[0] === 'overlay') {
      document.body.removeChild(overlay);
    }
  });

  const resultTable = document.createElement('div');
  resultTable.classList.add('result-table');
  overlay.appendChild(resultTable);

  const resultTableContent = document.createElement('div');
  resultTableContent.classList.add('result-table-content');
  resultTable.appendChild(resultTableContent);

  const table = createTable();

  resultTableContent.appendChild(table);

  document.body.appendChild(overlay);
}

function savedGame() {
  if (Settings.properties.isAnimation) return;

  const field = document.querySelector('.game-board').children;
  const arr = [];

  for (let i = 0; i < field.length; i += 1) {
    if (field[i].innerHTML === '') {
      arr.push('0');
    } else {
      arr.push(field[i].innerHTML);
    }
  }

  const step = Number(document.querySelector('.step').innerHTML);

  const finalSave = [];
  finalSave.push(Math.sqrt(arr.length));
  finalSave.push(arr);
  finalSave.push(history);
  finalSave.push(step);
  finalSave.push(Settings.properties.min);
  finalSave.push(Settings.properties.sec);
  finalSave.push(Settings.properties.num);

  localStorage.setItem('savv', JSON.stringify(finalSave));
  alert('Игра сохранена');
}

function lastGame() {
  if (Settings.properties.isAnimation) return;
  let game = localStorage.getItem('savv');
  if (game === null) {
    alert('Нету сохраненной игры');
    return;
  }
  game = JSON.parse(game);

  Settings.properties.game = game;

  Settings.properties.saveMode = true;

  const gameBoard = document.querySelector('.game-board');
  document.body.removeChild(gameBoard);

  makechain(game[0]);
}

export {
  makechain, autoSolver, bestResult, savedGame, lastGame,
};
