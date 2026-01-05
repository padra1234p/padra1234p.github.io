setInterval(() => {
    const s = document.createElement("span");
    s.innerText = Math.random() > 0.5 ? "X" : "O";
    s.style.color = s.innerText === "X" ? "red" : "blue";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    document.getElementById("bgAnim").appendChild(s);
    setTimeout(() => s.remove(), 4000);
}, 500);
