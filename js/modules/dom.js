export const buttonIds = ["#button1", "#button2", "#button3"];
export const mainMenu = document.getElementById('menu')
export const newGameBtn = document.getElementById('newgame');
export const loadGameBtn = document.getElementById('loadgame');
export const saveGameBtn = document.getElementById('savegame');
export const [button1, button2, button3] = buttonIds.map(id => document.querySelector(id));
export const controls = document.getElementById('controls')
export const stats = document.getElementById('stats')
export const intro = document.querySelector("#intro");
export const text = document.querySelector("#text");
export const xpText = document.querySelector("#xpText");
export const hpText = document.querySelector("#hpText");
export const goldText = document.querySelector("#goldText");
export const enemyStats = document.querySelector("#enemyStats");
export const enemyNameText = document.querySelector("#enemyName");
export const enemyHpText = document.querySelector("#enemyHp");