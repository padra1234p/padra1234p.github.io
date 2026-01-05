const size = 9;
const minesCount = 10;
const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const canvas = document.getElementById("confetti");
let cells = [];
let gameOver = false;
let audioCtx, soundReady=false;

function initSounds(){
    if(soundReady) return;
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    soundReady=true;
}

function beep(freq,d=0.15){
    if(!soundReady) return;
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value=freq;
    o.start();
    g.gain.setValueAtTime(0.25,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+d);
    o.stop(audioCtx.currentTime+d);
}

function start() {
    grid.innerHTML = "";
    cells = [];
    gameOver = false;
    overlay.style.display="none";

    for (let i = 0; i < size * size; i++) {
        cells.push({ mine: false, open: false, count: 0 });
    }

    // place mines
    let placed = 0;
    while (placed < minesCount) {
        let r = Math.floor(Math.random() * cells.length);
        if (!cells[r].mine) {
            cells[r].mine = true;
            placed++;
        }
    }

    // calculate counts
    cells.forEach((c,i)=>{
        if(c.mine) return;
        let x=i%size, y=Math.floor(i/size);
        for(let dx=-1;dx<=1;dx++)
            for(let dy=-1;dy<=1;dy++){
                let nx=x+dx, ny=y+dy, ni=ny*size+nx;
                if(cells[ni]?.mine) c.count++;
            }
    });

    // render
    cells.forEach((c,i)=>{
        const d=document.createElement("div");
        d.className="cell";
        d.oncontextmenu = e => {
            e.preventDefault();
            if(!c.open && !gameOver) d.innerText = d.innerText==="🚩"?"":"🚩";
        };
        d.onclick = () => openCell(i,d);
        grid.appendChild(d);
    });

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
}

function openCell(i,d){
    if(cells[i].open || d.innerText==="🚩" || gameOver) return;
    cells[i].open=true;
    d.classList.add("open");
    beep(600,0.1);

    if(cells[i].mine){
        d.classList.add("mine");
        d.innerText="💣";
        beep(200,0.4);
        gameOverFunc(false);
        return;
    }

    if(cells[i].count>0){
        d.innerText=cells[i].count;
    } else {
        // open neighbors recursively
        let x=i%size, y=Math.floor(i/size);
        for(let dx=-1;dx<=1;dx++)
            for(let dy=-1;dy<=1;dy++){
                let nx=x+dx, ny=y+dy, ni=ny*size+nx;
                if(cells[ni] && !cells[ni].open) {
                    const cellDiv = grid.children[ni];
                    openCell(ni,cellDiv);
                }
            }
    }

    // check win
    if(cells.filter(c=>!c.mine && !c.open).length===0){
        gameOverFunc(true);
    }
}

function gameOverFunc(win){
    gameOver=true;
    overlay.style.display="flex";
    message.innerText = win ? "You Win! 🎉" : "Game Over 💥";
    beep(win?900:200,0.4);
    if(win) confettiEffect();
    else shakeAllMines();
}

function shakeAllMines(){
    cells.forEach((c,i)=>{
        if(c.mine){
            const d = grid.children[i];
            d.classList.add("mine");
            d.innerText="💣";
        }
    });
}

function retry(){
    start();
}

function retryOverlay(){
    overlay.style.display="none";
    start();
}

/* ---------- CONFETTI ---------- */
function confettiEffect(){
    const ctx = canvas.getContext("2d");
    let p=Array.from({length:120},()=>({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*6+4,
        d:Math.random()*10,
        c:`hsl(${Math.random()*360},100%,50%)`
    }));
    let t=0;
    (function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        p.forEach(o=>{
            ctx.fillStyle=o.c;
            ctx.beginPath();
            ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
            ctx.fill();
            o.y+=Math.cos(t+o.d)+2;
        });
        t+=0.1;
        if(t<5) requestAnimationFrame(draw);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    })();
}

start();
