import { mainMenu, newGameBtn, loadGameBtn, saveGameBtn, controls, stats, intro, text } from "./dom.js";
import { startGame,loadGame,saveGame,gameState  } from "./game.js";
import { restart } from "./gameLogic.js";

export let weapons = [];
export let enemies = [];
export let locations = [];


export async function initializeGame() {
    await loadJSON();
    setupEventListeners();
}
// Función para cargar JSON
export async function loadJSON() {
    try {
        const [weaponsResponse, enemiesResponse, locationsResponse] = await Promise.all([
            fetch('https://raw.githubusercontent.com/leotosi07/proyecto-coder-62005/main/db/weapons.JSON'),
            fetch('https://raw.githubusercontent.com/leotosi07/proyecto-coder-62005/main/db/enemies.JSON'),
            fetch('https://raw.githubusercontent.com/leotosi07/proyecto-coder-62005/main/db/locations.JSON')
        ]);

        weapons = await weaponsResponse.json();
        enemies = await enemiesResponse.json();
        locations = await locationsResponse.json();

        console.log('Data loaded:', { weapons, enemies, locations });

        startGame();
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}
//start game
export function setupEventListeners() {
    newGameBtn.addEventListener('click', () => {
        setDisplay([newGameBtn, loadGameBtn], "none");
        restart()

        let playerForm = document.createElement('form');
        let input = document.createElement('input');
        input.type = 'text';
        input.name = 'playerName';
        input.placeholder = 'Enter your name';
        let submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Iniciar';
        playerForm.appendChild(input);
        playerForm.appendChild(submitButton);
        mainMenu.appendChild(playerForm);

        playerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            gameState.playerName = input.value.trim();
            if (gameState.playerName === '') {
                Swal.fire({
                    title: 'Please enter your name.',
                    width: '25em',
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
            } else {
                setDisplay([newGameBtn, loadGameBtn, saveGameBtn, text, controls, stats], "block");
                setDisplay([intro, playerForm], "none");

            }
        });
    });
    loadGameBtn.addEventListener('click', () => {
        loadGame()
    });
    saveGameBtn.addEventListener('click', () => {
        saveGame()
    });
}



export function setDisplay(elements, displayStyle) {
    elements.forEach(element => {
        element.style.display = displayStyle;
    });
}
