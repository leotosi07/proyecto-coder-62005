import { button1, button2, button3, newGameBtn, loadGameBtn, saveGameBtn, controls, stats, intro, text } from "./dom.js";
import { weapons, enemies, locations,setDisplay } from "./events.js";
import { update,goTown,goStore,goDungeon,updateStats,restart } from "./gameLogic.js";
import { fightEnemy,attack,dodge,lose } from "./combat.js";

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
    updateWeapon()
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
    dodge,
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
            updateWeapon()
            updateStats();
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
    }
}

export function updateWeapon(){
    locations[1].buttonText[1] = `Buy weapon (${weapons[gameState.currentWeapon + 1] ? weapons[gameState.currentWeapon + 1].cost : "No"} gold)`;
    updateButton2(locations[1]);
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
            goStore();
            updateWeapon()
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
        title: 'Do you want to save a new slot (OK for new slot, Cancel for overwrite unless it is a new game)?',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        position: 'top',
        showClass: {
            popup: 'animate__animated animate__backInDown animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__backOutUp animate__faster'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            handleNewSlot(saves);
        } else {
            handleOverwrite(saves);
        }
    });
}

function handleNewSlot(saves) {
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
                overwriteSlot(saves, parseInt(result.value, 10) - 1);
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
}

function handleOverwrite(saves) {
    Swal.fire({
        title: 'Select a slot to overwrite:',
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
            overwriteSlot(saves, parseInt(result.value, 10) - 1);
        }
    });
}

function overwriteSlot(saves, index) {
    saves[index] = createSaveData();
    localStorage.setItem('saves', JSON.stringify(saves));
    Swal.fire({
        icon: 'success',
        title: 'Slot overwritten!',
        position: 'top'
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
