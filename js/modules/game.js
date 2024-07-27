import { button1, button2, button3, newGameBtn, loadGameBtn, saveGameBtn, controls, stats, intro, text, xpText, hpText, goldText, enemyStats, enemyNameText, enemyHpText } from "./dom.js";
import { weapons, enemies, locations,setDisplay,playerName } from "./events.js";

export let xp = 0;
export let hp = 100;
export let gold = 30;
export let currentWeapon = 0;
export let fighting;
export let inventory = ["rod"];

export let enemyHp = ''


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
    dodge,
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
    if (gold >= 10) {
        gold -= 10;
        hp += 10;
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
    if (currentWeapon < weapons.length - 1) {
        if (gold >= weapons[currentWeapon + 1].cost) {
            gold -= weapons[currentWeapon + 1].cost;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
            locations[1].buttonText[1] = `Buy weapon (${weapons[currentWeapon + 1] ? weapons[currentWeapon + 1].cost : "No"} gold)`;
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
    if (inventory.length > 1) {
        gold += 15;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
        updateStats();
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

export function fightEnemy(index) {
    fighting = index;
    goFight();
}

export function goFight() {
    update(locations[3]);
    enemyHp = enemies[fighting].hp;
    setDisplay([enemyStats], "block");
    enemyNameText.innerText = enemies[fighting].name;
    enemyHpText.innerText = enemyHp;
}

export function attack() {
    text.innerText = "The " + enemies[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

    if (isEnemyHit()) {
        hp -= getEnemyAttackValue(enemies[fighting].level);
    } else {
        text.innerText += " You miss.";
    }

    enemyHp -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    hpText.innerText = hp;
    enemyHpText.innerText = enemyHp;
    if (hp <= 0) {
        lose();
    } else if (enemyHp <= 0) {
        enemies[fighting].name === "King" ? winGame() : defeatEnemy();
    }
}

export function getEnemyAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    return Math.max(hit, 0);
}

export function isEnemyHit() {
    return Math.random() > .2 || hp < 20;
}


export function dodge() {
    text.innerText = "You dodge the attack from the " + enemies[fighting].name + ".";
}

export function defeatEnemy() {
    gold += Math.floor(enemies[fighting].level * 6.7)
    xp += enemies[fighting].level;
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
    xp = 0;
    hp = 100;
    gold = 30;
    currentWeapon = 0;
    inventory = ["rod"];
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
        gold += 20;
        updateStats();
    } else {
        text.innerText += "Wrong! You lose 20 hp!"
        hp -= 20;
        updateStats();
        if (hp <= 0) {
            lose();
        }
    }
}
export function updateStats() {
    goldText.innerText = gold;
    hpText.innerText = hp;
    xpText.innerText = xp;
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
            xp = selectedSave.xp;
            hp = selectedSave.hp;
            gold = selectedSave.gold;
            currentWeapon = selectedSave.currentWeapon;
            inventory = selectedSave.inventory;
            playerName = selectedSave.playerName;
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
        xp: xp,
        hp: hp,
        gold: gold,
        currentWeapon: currentWeapon,
        inventory: inventory,
        playerName: playerName,
        timestamp: new Date().toLocaleString()
    };
}
