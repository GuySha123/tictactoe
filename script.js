document.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.getElementById('gameStatus');
    const restartButton = document.getElementById('restartButton');
    const gameBoard = document.getElementById('gameBoard');
    const cells = document.querySelectorAll('[data-cell]');
    let isPlayerTurn = true;
    let gameActive = true;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6]            // Diagonal
    ];

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    function handleCellClick(e) {
        const cell = e.target;
        if (!isPlayerTurn || cell.textContent.trim() !== '' || !gameActive) {
            return;
        }
        playMove(cell, 'X');
        if (checkResult('X')) {
            return;
        }
        isPlayerTurn = false;
        setTimeout(() => {
            computerMove();
            isPlayerTurn = true;
        }, 500);
    }

    function computerMove() {
        if (!gameActive) return;

        if (!findWinningOrBlockingMove('O') && !findWinningOrBlockingMove('X')) {
            if (cells[4].textContent === '') {
                playMove(cells[4], 'O');
            } else {
                const corners = [0, 2, 6, 8];
                const availableCorners = corners.filter(i => cells[i].textContent === '');
                if (availableCorners.length) {
                    const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
                    playMove(cells[randomCorner], 'O');
                } else {
                    const availableCells = Array.from(cells).filter(cell => cell.textContent === '');
                    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
                    playMove(randomCell, 'O');
                }
            }
        }
        checkResult('O');
    }

    function findWinningOrBlockingMove(player) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent === '') {
                cells[i].textContent = player;
                const win = checkResult(player, false);
                cells[i].textContent = '';
                if (win) {
                    playMove(cells[i], 'O');
                    return true;
                }
            }
        }
        return false;
    }

    function playMove(cell, player) {
        cell.textContent = player;
    }

    function checkResult(player, updateGameState = true) {
        for (let combination of winningCombinations) {
            if (combination.every(index => cells[index].textContent === player)) {
                if (updateGameState) {
                    highlightWinningCells(combination);
                    endGame(player === 'X' ? 'Player Wins!' : 'Computer Wins!');
                }
                return true;
            }
        }
        if (updateGameState && Array.from(cells).every(cell => cell.textContent.trim() !== '')) {
            endGame('Tie!');
            return true;
        }
        return false;
    }

    function highlightWinningCells(combination) {
        gameBoard.classList.remove('horizontal', 'vertical', 'diagonal');
        const directionClass = getWinDirectionClass(combination);
        gameBoard.classList.add(directionClass);
    }

    function getWinDirectionClass(combination) {
        if (combination.every(index => [0, 1, 2].includes(index))) return 'horizontal-0';
        if (combination.every(index => [3, 4, 5].includes(index))) return 'horizontal-1';
        if (combination.every(index => [6, 7, 8].includes(index))) return 'horizontal-2';
        if (combination.every(index => [0, 3, 6].includes(index))) return 'vertical-0';
        if (combination.every(index => [1, 4, 7].includes(index))) return 'vertical-1';
        if (combination.every(index => [2, 5, 8].includes(index))) return 'vertical-2';
        if (combination.includes(0) && combination.includes(4) && combination.includes(8)) return 'diagonal';
        if (combination.includes(2) && combination.includes(4) && combination.includes(6)) return 'diagonal-1';
    }

    function endGame(message) {
        statusDisplay.textContent = message;
        gameActive = false;
    }

    function restartGame() {
        gameActive = true;
        isPlayerTurn = true;
        statusDisplay.textContent = "Player's Turn";
        cells.forEach(cell => {
            cell.textContent = '';
        });
        gameBoard.classList.remove('horizontal-0', 'horizontal-1', 'horizontal-2', 'vertical-0', 'vertical-1', 'vertical-2', 'diagonal', 'diagonal-1');
    }
});
