import { text, hpText, enemyStats, enemyNameText, enemyHpText } from "./dom.js";
import { weapons, enemies, locations,setDisplay } from "./events.js";
import { update,updateStats } from "./gameLogic.js";
import { gameState } from "./game.js";

export function fightEnemy(index) {
    gameState.fighting = index;
    goFight();
}

export function goFight() {
    update(locations[3]);
    gameState.enemyHp = enemies[gameState.fighting].hp;
    setDisplay([enemyStats], "block");
    enemyNameText.innerText = enemies[gameState.fighting].name;
    enemyHpText.innerText = gameState.enemyHp;
}

export function attack() {
    text.innerText = "The " + enemies[gameState.fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[gameState.currentWeapon].name + ".";

    if (isEnemyHit()) {
        gameState.hp -= getEnemyAttackValue(enemies[gameState.fighting].level);
    } else {
        text.innerText += " You miss.";
    }

    gameState.enemyHp -= weapons[gameState.currentWeapon].power + Math.floor(Math.random() * gameState.xp) + 1;
    hpText.innerText = gameState.hp;
    enemyHpText.innerText = gameState.enemyHp;
    if (gameState.hp <= 0) {
        lose();
    } else if (gameState.enemyHp <= 0) {
        enemies[gameState.fighting].name === "King" ? winGame() : defeatEnemy();
    }
}

export function dodge() {
    text.innerText = "You dodge the attack from the " + enemies[gameState.fighting].name + ".";
}

export function getEnemyAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * gameState.xp));
    return Math.max(hit, 0);
}

export function isEnemyHit() {
    return Math.random() > .2 || gameState.hp < 20;
}

export function defeatEnemy() {
    gameState.gold += Math.floor(enemies[gameState.fighting].level * 6.7)
    gameState.xp += enemies[gameState.fighting].level;
    updateStats();
    update(locations[4]);
}

export function lose() {
    update(locations[5]);
}

export function winGame() {
    update(locations[6]);
}