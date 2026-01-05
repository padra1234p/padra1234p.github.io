const board = Array(9).fill("");
let turn = "X";
let gameOver = false;
const cells = document.querySelectorAll(".cell");
const info = document.getElementById("info");

function checkWin() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (let w of wins) {
        const [a,b,c] = w;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver=true;
            info.innerText = `${board[a]} wins! 🎉`;
            return true;
        }
    }
    if (!board.includes("")) {
        gameOver=true;
        info.innerText="Draw!";
        return true;
    }
    return false;
}

cells.forEach(cell => {
    cell.addEventListener("click", ()=>{
        const idx = cell.dataset.index;
        if (!board[idx] && !gameOver) {
            board[idx] = turn;
            cell.innerText = turn;
            cell.style.color = turn==="X"?"red":"blue";
            if(!checkWin()) turn = turn==="X"?"O":"X";
        }
    });
});
