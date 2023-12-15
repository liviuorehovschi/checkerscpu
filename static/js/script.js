document.addEventListener("DOMContentLoaded", function() {
    let selectedPiece = null;
    let currentPlayer = localStorage.getItem('currentPlayer') || 'R';
    loadBoard();

    document.getElementById("board").addEventListener("click", function(event) {
        if (currentPlayer !== 'R') {  // Prevent moves during CPU's turn
            return;
        }

        let clickedElement = event.target;
        console.log(clickedElement, currentPlayer, clickedElement.classList.contains("piece"), clickedElement.classList, clickedElement.classList.contains(currentPlayer))

        if (clickedElement.classList.contains("piece") && (clickedElement.classList.contains(currentPlayer) || clickedElement.classList.contains(`${currentPlayer}Q`))) {
            selectedPiece = clickedElement;
            console.log(selectedPiece)
        } else if (selectedPiece && clickedElement.classList.contains("cell")) {
            let startX = parseInt(selectedPiece.parentElement.dataset.x, 10);
            let startY = parseInt(selectedPiece.parentElement.dataset.y, 10);
            let endX = parseInt(clickedElement.dataset.x, 10);
            let endY = parseInt(clickedElement.dataset.y, 10);

            fetch('/move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ start: [startX, startY], end: [endX, endY] }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.game_over) {
                    let message = `Game Over. ${data.winner === 'R' ? 'Red' : 'Black'} wins!`;
                    alert(message);
                } else if (data.valid) {
                    updateBoard(data.board);
                    currentPlayer = data.current_player;
                    localStorage.setItem('currentPlayer', currentPlayer);
                } else if (data.mandatory_capture) {
                    alert("A capture is available and mandatory. You must make a capture move.");
                }
                selectedPiece = null;
            });
        }
    });

    function saveBoard() {
        let board = [];
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            let piece = cell.querySelector('.piece');
            board.push(piece ? piece.className.split(' ')[1] : ' ');
        });
        localStorage.setItem('board', JSON.stringify(board));
    }

    function loadBoard() {
        let board = JSON.parse(localStorage.getItem('board'));
        if (board && board.length === 64) {
            updateBoard(board);
        }
    }

    function updateBoard(newBoard) {
        let cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            let row = Math.floor(index / 8);
            let col = index % 8;
            let className = newBoard[row][col] === ' ' ? '' : 'piece ' + newBoard[row][col];
            if (newBoard[row][col].includes('Q')) {
                className += ' queen';
            }
            cell.innerHTML = className ? `<div class="${className}"></div>` : '';
        });
    }

    window.resetGame = function() {
        localStorage.removeItem('board');
        localStorage.removeItem('currentPlayer');
        fetch('/reset').then(() => {
            window.location.reload();
        });
    };
});
