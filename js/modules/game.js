import { button1, button2, button3, newGameBtn, loadGameBtn, saveGameBtn, controls, stats, intro, text, xpText, hpText, goldText, enemyStats, enemyNameText, enemyHpText } from "./dom.js";
import { weapons, enemies, locations,setDisplay } from "./events.js";

export const gameState = {
    xp: 0,
    hp: 100,
    gold: 30,
    currentWeapon: 0,
    fighting: null,
    inventory: ["rod"],
    enemyHp: '',
    playerName: ''
};


export function startGame() {
    update(locations[8]);
}


export const functionMap = {
    goTown,
    goStore,
    goDungeon,
    fightEnemy: (index) => fightEnemy(index),
    buyHp,
    buyWeapon,
    attack,
    restart,
    easterEgg,
    pickTwo,
    pickEight
};

// Función para ejecutar una función desde una cadena de texto
export function executeFunction(functionString) {
    if (!weapons.length || !enemies.length || !locations.length) {
        console.error('Data not loaded yet.');
        return;
    }

    const functionName = functionString.split('(')[0];
    const args = functionString.includes('(') ? functionString.match(/\((.*?)\)/)[1].split(',') : [];

    if (functionMap[functionName]) {
        functionMap[functionName](...args);
    } else {
        console.error(`Function ${functionName} not found in functionMap`);
    }
}







// initialize buttons

button1.onclick = goStore;
button2.onclick = goDungeon;
button3.onclick = fightEnemy.bind(null, 2);

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

export function buyHp() {
    if (gameState.gold >= 10) {
        gameState.gold -= 10;
        gameState.hp += 10;
        updateStats();
    } else {
        text.innerText = "You do not have enough gold to buy hp.";
    }

}
export function updateButton2(location) {
    button2.innerText = location.buttonText[1];
    button2.onclick = location.buttonFunctions[1];
}
export function buyWeapon() {
    if (gameState.currentWeapon < weapons.length - 1) {
        if (gameState.gold >= weapons[gameState.currentWeapon + 1].cost) {
            gameState.gold -= weapons[gameState.currentWeapon + 1].cost;
            gameState.currentWeapon++;
            let newWeapon = weapons[gameState.currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            gameState.inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + gameState.inventory;
            locations[1].buttonText[1] = `Buy weapon (${weapons[gameState.currentWeapon + 1] ? weapons[gameState.currentWeapon + 1].cost : "No"} gold)`;
            updateButton2(locations[1]);
            updateStats();
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

export function sellWeapon() {
    if (gameState.inventory.length > 1) {
        gameState.gold += 15;
        gameState.currentWeapon = gameState.inventory.shift();
        text.innerText = "You sold a " + gameState.currentWeapon + ".";
        text.innerText += " In your inventory you have: " + gameState.inventory;
        updateStats();
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

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

export function easterEgg() {
    update(locations[7]);
}

export function pickTwo() {
    pick(2);
}

export function pickEight() {
    pick(8);
}

export function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold!"
        gameState.gold += 20;
        updateStats();
    } else {
        text.innerText += "Wrong! You lose 20 hp!"
        gameState.hp -= 20;
        updateStats();
        if (gameState.hp <= 0) {
            lose();
        }
    }
}
export function updateStats() {
    goldText.innerText = gameState.gold;
    hpText.innerText = gameState.hp;
    xpText.innerText = gameState.xp;
}

export function loadGame() {
    const saves = JSON.parse(localStorage.getItem('saves')) || [];
    if (saves.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'No saved games found!',
            position: 'top',
            showClass: {
                popup: `
                animate__animated
                animate__backInDown
                animate__faster
                `
            },
            hideClass: {
                popup: `
                animate__animated
                animate__backOutUp
                animate__faster
                `
            }

        });
        return;
    }

    const saveOptions = saves.map((save, index) => `${index + 1}: ${save.playerName} - ${save.timestamp}`).join('\n');

    Swal.fire({
        title: 'Select a save slot to load:',
        input: 'text',
        inputLabel: saveOptions,
        position: 'top',
        showClass: {
            popup: `
            animate__animated
            animate__backInDown
            animate__faster
            `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__backOutUp
            animate__faster
            `
        },
        showCancelButton: true,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                const selectedSaveIndex = parseInt(value, 10);

                if (!isNaN(selectedSaveIndex) && selectedSaveIndex >= 1 && selectedSaveIndex <= saves.length) {
                    resolve();
                } else {
                    resolve('Invalid selection!');
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedSaveIndex = parseInt(result.value, 10);
            const selectedSave = saves[selectedSaveIndex - 1];
            gameState.xp = selectedSave.xp;
            gameState.hp = selectedSave.hp;
            gameState.gold = selectedSave.gold;
            gameState.currentWeapon = selectedSave.currentWeapon;
            gameState.inventory = selectedSave.inventory;
            gameState.playerName = selectedSave.playerName;
            updateStats();
            setDisplay([intro], "none");
            setDisplay([text, controls, stats, saveGameBtn, loadGameBtn, newGameBtn], "block");
            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Game loaded!'
            });
        }
    });
}

export function saveGame() {
    const saves = JSON.parse(localStorage.getItem('saves')) || [];

    Swal.fire({
        title: 'Do you want to save a new slot (ok for new slot, cancel for overwrite unless it is a new game)?',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        position: 'top',
        showClass: {
            popup: `
            animate__animated
            animate__backInDown
            animate__faster
            `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__backOutUp
            animate__faster
            `
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (saves.length >= 9) {
                Swal.fire({
                    title: 'No more slots available, you need to overwrite.',
                    input: 'text',
                    position: 'top',
                    inputLabel: saves.map((save, index) => `${index + 1}: ${save.playerName} - ${save.timestamp}`).join('\n'),
                    inputValidator: (value) => {
                        return new Promise((resolve) => {
                            const selectedSaveIndex = parseInt(value, 10);

                            if (!isNaN(selectedSaveIndex) && selectedSaveIndex >= 1 && selectedSaveIndex <= saves.length) {
                                resolve();
                            } else {
                                resolve('Invalid selection!');
                            }
                        });
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const selectedSaveIndex = parseInt(result.value, 10) - 1;
                        saves[selectedSaveIndex] = createSaveData();
                        localStorage.setItem('saves', JSON.stringify(saves));
                        Swal.fire({
                            icon: 'success',
                            title: 'Slot overwritten!',
                            position: 'top'
                        });
                    }
                });
            } else {
                saves.push(createSaveData());
                localStorage.setItem('saves', JSON.stringify(saves));
                Swal.fire({
                    icon: 'success',
                    title: 'New slot created!',
                    position: 'top'
                });
            }
        } else {
            if (saves.length >= 9) {
                Swal.fire({
                    title: 'No more slots available, you need to overwrite.',
                    input: 'text',
                    position: 'top',
                    inputLabel: saves.map((save, index) => `${index + 1}: ${save.playerName} - ${save.timestamp}`).join('\n'),
                    inputValidator: (value) => {
                        return new Promise((resolve) => {
                            const selectedSaveIndex = parseInt(value, 10);

                            if (!isNaN(selectedSaveIndex) && selectedSaveIndex >= 1 && selectedSaveIndex <= saves.length) {
                                resolve();
                            } else {
                                resolve('Invalid selection!');
                            }
                        });
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const selectedSaveIndex = parseInt(result.value, 10) - 1;
                        saves[selectedSaveIndex] = createSaveData();
                        localStorage.setItem('saves', JSON.stringify(saves));
                        Swal.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'Slot overwritten!'
                        });
                    }
                });
            } else {
                saves.push(createSaveData());
                localStorage.setItem('saves', JSON.stringify(saves));
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'New slot created!'
                });
            }
        }
    });
}

export function createSaveData() {
    return {
        xp: gameState.xp,
        hp: gameState.hp,
        gold: gameState.gold,
        currentWeapon: gameState.currentWeapon,
        inventory: gameState.inventory,
        playerName: gameState.playerName,
        timestamp: new Date().toLocaleString()
    };
}
