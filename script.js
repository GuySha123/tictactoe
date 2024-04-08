const statusDisplay = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');
const cells = document.querySelectorAll('[data-cell]');
let isXTurn = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const currentPlayer = isXTurn ? 'X' : 'O';
    cell.textContent = currentPlayer;
    if (checkWin(currentPlayer)) {
        statusDisplay.textContent = `${currentPlayer} Wins!`;
        return;
    }
    if (checkTie()) {
        statusDisplay.textContent = 'Tie!';
        return;
    }
    isXTurn = !isXTurn;
    statusDisplay.textContent = `${isXTurn ? 'X' : 'O'}'s Turn`;
}

function checkWin(currentPlayer) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
}

function checkTie() {
    return [...cells].every(cell => {
        return cell.textContent === 'X' || cell.textContent === 'O';
    });
}

function restartGame() {
    isXTurn = true;
    statusDisplay.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);
