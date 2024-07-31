import { button1, button2, button3, saveGameBtn, controls, stats, intro, text, xpText, hpText, goldText, enemyStats } from "./dom.js";
import { locations,setDisplay } from "./events.js";
import { gameState,executeFunction } from "./game.js";

export function update(location) {
    enemyStats.style.display = "none";
    button1.innerText = location.buttonText[0];
    button2.innerText = location.buttonText[1];
    button3.innerText = location.buttonText[2];

    button1.onclick = () => executeFunction(location.buttonFunctions[0]);
    button2.onclick = () => executeFunction(location.buttonFunctions[1]);
    button3.onclick = () => executeFunction(location.buttonFunctions[2]);

    text.innerText = location.text;
}

export function goTown() {
    update(locations[0]);
}

export function goStore() {
    update(locations[1]);
}

export function goDungeon() {
    update(locations[2]);
}

export function updateStats() {
    goldText.innerText = gameState.gold;
    hpText.innerText = gameState.hp;
    xpText.innerText = gameState.xp;
}

export function restart() {
    gameState.xp = 0;
    gameState.hp = 100;
    gameState.gold = 30;
    gameState.currentWeapon = 0;
    gameState.inventory = ["rod"];
    updateStats();
    update(locations[8]);
    setDisplay([intro], "block");
    setDisplay([stats, controls, text, saveGameBtn], "none");
}