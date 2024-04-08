const statusDisplay = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');
const cells = document.querySelectorAll('[data-cell]');
let isPlayerTurn = true;

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
    if (!isPlayerTurn || cell.textContent !== '') {
        return;
    }
    makeMove(cell, 'X');
    if (endTurn('X')) {
        return; // Check if game has ended
    }
    isPlayerTurn = false;
    setTimeout(computerMove, 500); // Delay computer's move to simulate thinking delay
}

function computerMove() {
    const availableCells = [...cells].filter(cell => cell.textContent === '');
    if (availableCells.length === 0) {
        return;
    }

    // Try to find a winning move or block the player
    let moveFound = findBestMove('O') || findBestMove('X');
    
    // If no strategic move found, pick a random cell
    if (!moveFound) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        makeMove(randomCell, 'O');
    }
    endTurn('O');
    isPlayerTurn = true;
}

function findBestMove(player) {
    const availableCells = [...cells].filter(cell => cell.textContent === '');
    for (let cell of availableCells) {
        cell.textContent = player; // Temporarily make the move
        if (checkWin(player)) {
            if (player === 'O') {
                // It's a winning move for the computer
                return true;
            } else {
                // Block the player's winning move
                cell.textContent = 'O';
                return true;
            }
        }
        cell.textContent = ''; // Undo the move
    }
    return false;
}

function makeMove(cell, player) {
    cell.textContent = player;
}

function endTurn(player) {
    if (checkWin(player)) {
        statusDisplay.textContent = `${player === 'X' ? 'Player' : 'Computer'} Wins!`;
        return true;
    } else if (checkTie()) {
        statusDisplay.textContent = 'Tie!';
        return true;
    }
    statusDisplay.textContent = `${player === 'X' ? "Computer's Turn" : "Player's Turn"}`;
    return false;
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
    isPlayerTurn = true;
    statusDisplay.textContent = "Player's Turn";
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);
