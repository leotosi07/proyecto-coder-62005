let xp = 0;
let hp = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monterHp;
let inventory = ["rod"];
let playerName = '';

const buttonIds = ["#button1", "#button2", "#button3"];

/*DOM*/


const newGame = document.getElementById('newgame');
const loadGame = document.getElementById('loadgame');
const saveGame = document.getElementById('savegame');
const [button1, button2, button3] = buttonIds.map(id => document.querySelector(id));
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const hpText = document.querySelector("#hpText");
const goldText = document.querySelector("#goldText");
const enemyStats = document.querySelector("#enemyStats");
const enemyNameText = document.querySelector("#enemyName");
const enemyHpText = document.querySelector("#enemyHp");

const weapons = [
    {
        name: "rod",
        power: 5,
        cost:0,
    },
    {
        name: "dagger",
        power: 30,
        cost:50,
    },
    {
        name: "rusted Axe",
        power: 50,
        cost:100,
    },
    {
        name: "sword",
        power: 100,
        cost:150,
    }
];

const enemys = [
    {
        name: "Skeleton",
        level: 2,
        hp: 15
    },
    {
        name: "Camelot Soldier",
        level: 8,
        hp: 60
    },
    {
        name: "King",
        level: 20,
        hp: 300
    }
];

const locations = [
    {
        name: "town entrance",
        buttonText: ["Go to store", "Go to dungeon", "Fight King"],
        buttonFunctions: [goStore, goDungeon, fightEnemy.bind(null, 2)],
        text: "You are in the town entrance. You see a sign that says \"Store.\""
    },
    {
        name: "store",
        buttonText: ["Buy 10 hp (10 gold)", `Buy weapon (50 gold)`, "Go to town entrance"],
        buttonFunctions: [buyHp, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "dungeon",
        buttonText: ["Fight Skeleton", "Fight Camelot Soldier", "Go to town entrance"],
        buttonFunctions: [fightEnemy.bind(null, 0), fightEnemy.bind(null, 1), goTown],
        text: "You enter the dungeon. You see some enemies."
    },
    {
        name: "fight",
        buttonText: ["Attack", "Dodge", "Run"],
        buttonFunctions: [attack, dodge, goTown],
        text: "You are fighting an enemy."
    },
    {
        name: "kill enemy",
        buttonText: ["Go to town entrance", "Go to town entrance", "Go to town entrance"],
        buttonFunctions: [goTown, goTown, easterEgg],
        text: 'The enemy screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
        buttonFunctions: [restart, restart, restart],
        text: "You die. ☠️"
    },
    {
        name: "win",
        buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
        buttonFunctions: [restart, restart, restart],
        text: "You defeat the King! YOU WIN THE GAME! 🎉"
    },
    {
        name: "easter egg",
        buttonText: ["2", "8", "Go to town entrance?"],
        buttonFunctions: [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
]

const showButtons = () => {
    const selector = buttonIds.join(", ");
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(button => {
        button.style.display = "inline";
    });
};

// initialize buttons

button1.onclick = goStore;
button2.onclick = goDungeon;
button3.onclick = fightEnemy.bind(null, 2);

function update(location) {
    enemyStats.style.display = "none";
    button1.innerText = location.buttonText[0];
    button2.innerText = location.buttonText[1];    
    button3.innerText = location.buttonText[2];
    button1.onclick = location.buttonFunctions[0];
    button2.onclick = location.buttonFunctions[1];
    button3.onclick = location.buttonFunctions[2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goDungeon() {
    update(locations[2]);
}

function buyHp() {
    if (gold >= 10) {
        gold -= 10;
        hp += 10;
        updateStats();
    } else {
        text.innerText = "You do not have enough gold to buy hp.";
    }

}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= weapons[currentWeapon + 1].cost) {
            gold -= weapons[currentWeapon + 1].cost;
            currentWeapon++;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
            locations[1].buttonText[1] = `Buy weapon (${weapons[currentWeapon + 1] ? weapons[currentWeapon + 1].cost : "No"} gold)`;
            update(locations[1]);
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

function sellWeapon() {
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

function fightEnemy(index) {
    fighting = index;
    goFight();
}

function goFight() {
    update(locations[3]);
    enemyHp = enemys[fighting].hp;
    enemyStats.style.display = "block";
    enemyNameText.innerText = enemys[fighting].name;
    enemyHpText.innerText = enemyHp;
}

function attack() {
    text.innerText = "The " + enemys[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

    if (isEnemyHit()) {
        hp -= getEnemyAttackValue(enemys[fighting].level);
    } else {
        text.innerText += " You miss.";
    }

    enemyHp -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    hpText.innerText = hp;
    enemyHpText.innerText = enemyHp;
    if (hp <= 0) {
        lose();
    } else if (enemyHp <= 0) {
        fighting === 2 ? winGame() : defeatEnemy();
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
    }
}

function getEnemyAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    return hit;
}

function isEnemyHit() {
    return Math.random() > .2 || hp < 20;
}


function dodge() {
    text.innerText = "You dodge the attack from the " + enemys[fighting].name + ".";
}

function defeatEnemy() {
    gold += Math.floor(enemys[fighting].level * 6.7)
    xp += enemys[fighting].level;
    updateStats();
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    hp = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["rod"];
    updateStats();
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
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
        text.innerText += "Wrong! You lose 10 hp!"
        hp -= 10;
        updateStats();
        if (hp <= 0) {
            lose();
        }
    }
}
function updateStats() {
    goldText.innerText = gold;
    hpText.innerText = hp;
    xpText.innerText = xp;
}