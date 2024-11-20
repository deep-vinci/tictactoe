let withComputer = document.querySelector(".with-computer")
let withAFriend = document.querySelector(".with-a-friend")

let gameBoardContainer = document.querySelector(".game-board-container");
let gameBoardDivs = document.querySelectorAll(".game-cell");
let gameButton = document.querySelectorAll(".game-button");
let gameControls = document.querySelector(".game-controls");
let restartButton = document.querySelector(".game-restart");
let endGame = document.querySelector(".game-end");

let startPage = document.querySelector(".start-page");
let markerPage = document.querySelector(".marker-page");
let gamePage = document.querySelector(".game-page");

let markerButtons = document.querySelectorAll(".marker-button");

let statusBox = document.querySelector(".status-box");

function gameBoard () {

    const markers = {
        x: "X",
        o: "O",
        placeholder: 1
    }
    const modes = {
        player: "player",
        computer: "computer"
    }

    const svg = {
        X: `<svg width="100" height="100" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.058 9.95032L45.8789 46.0084M45.8789 46.0084L79.8292 81.1649M45.8789 46.0084L81.0355 12.058M45.8789 46.0084L9.82083 80.8292" stroke="white" stroke-width="26"/>
        </svg>`,
        O: `<svg width="100" height="100" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="45" cy="45" r="32" stroke="white" stroke-width="26"/>
        </svg>`
    }

    let defaultUserMarker = markers.x;
    let defaultplayMode = modes.player;
    let board = new Array(9).fill(markers.placeholder)
    
    
    // hacky part to print the board thats decipherable in console for debgging purpose
    function printBoard() {
        let boardString = structuredClone(board);
        boardString[2] += "\n";
        boardString[5] += "\n";
        boardString[8] += "\n";             
        
        console.log(`
        Game Board
        
        ${boardString.join(" ")}
        `)
    }
    
    function changeDefaultPlayMode (mode) {
        defaultplayMode = mode;
    }

    function changeDefaultUserMarker(marker) {
        defaultUserMarker = marker;
    }

    function user(marker, index) {
        return { 
            user: marker,
            marker,
            index,
        }
    }
    
    // args is the user function
    function enterUserChoice(userObject) {
        board[userObject.index] = userObject.marker;
    }
    
    function displayWinner(winnerObj) {
        winnerObj.sequence.forEach((e, i) => {
            gameBoardDivs[e].classList.add("game-cell-wins");
        })
        gameBoardContainer.classList.add("pointer-events-none")
        // statusBox.textContent = `Player ${winnerObj.winner} won`
        // statusBox.style.display = "block";
    }
    
    function displayTheMarkers (div, svg) {
        div.innerHTML = svg;
    }
    
    function checkForWins() {
        const winSequence = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagons
        ];
        
        // Iterate over each winning sequence
        for (let i = 0; i < winSequence.length; i++) {
            let singleSequence = winSequence[i];
            
            // Check the elements of the current winning sequence
            for (let i2 = 0; i2 < singleSequence.length; i2++) {
                if (i2 === 0) {
                    if (board[singleSequence[i2]] === board[singleSequence[i2 + 1]] && board[singleSequence[i2 + 1]] === board[singleSequence[i2 + 2]]) {
                        if (board[singleSequence[i2]] === markers.x || board[singleSequence[i2]] === markers.o) {
                            // Return immediately when a winning sequence is found
                            let winData = {
                                status: 1,
                                winner: board[singleSequence[i2]],
                                sequence: singleSequence
                            };
                            displayWinner(winData);
                            return winData;
                        }
                    }
                }
            }
        }
    
        // Return status 0 if no winning sequence is found
        return {
            status: 0
        };
    }
    
    function makeMoveAndCheckWin(marker, choiceIndex, gameDiv) {
        enterUserChoice(user(marker, choiceIndex));
        displayTheMarkers(gameDiv, svg[marker]);
        checkForWins();
    }
    
    function startGame () {
        let index = 0;
        
        gameBoardDivs.forEach((gameBoardDiv, i) => {
            gameBoardDiv.addEventListener("click", () => {
                let userChoiceIndex = parseInt(gameBoardDiv.classList[0].at(-1));
                if (board[userChoiceIndex] != markers.placeholder) {
                    return;
                } 
                
                if (index%2 == 0) {
                    let nonDefaultUserMarker = (defaultUserMarker == markers.x) ? markers.o : markers.x;

                    makeMoveAndCheckWin(defaultUserMarker, userChoiceIndex, gameBoardDiv)

                    if (defaultplayMode == modes.computer) {
                        let emptyCellsIndex = board
                            .map((e,i) => e == markers.placeholder ? i : undefined)
                            .filter(x => x !== undefined);

                        let computersRandomChoice = Math
                            .floor(Math.random() * emptyCellsIndex.length);
                            
                        let gameDiv = gameBoardDivs[emptyCellsIndex[computersRandomChoice]];
                        
                        makeMoveAndCheckWin(nonDefaultUserMarker, emptyCellsIndex[computersRandomChoice], gameDiv)

                        index++;
                    }

                    index++;
                } else {
                    let nonDefaultUserMarker = (defaultUserMarker == markers.x) ? markers.o : markers.x;
                    
                    makeMoveAndCheckWin(nonDefaultUserMarker, userChoiceIndex, gameBoardDiv)

                    index++;
                }
            })
        })
    }
    return { modes, changeDefaultPlayMode, changeDefaultUserMarker, startGame }
}


let newGame = gameBoard();
newGame.startGame();


restartButton.addEventListener("click", () => {
    location.reload()
})


// withAFriend and withComputer can be combined using foreach but for god knows what reason its not working
withAFriend.addEventListener("click", () => {
    newGame.changeDefaultPlayMode(newGame.modes.player);
    startPage.style.display = "none";
    markerPage.style.display = "flex";
})

withComputer.addEventListener("click", () => {
    newGame.changeDefaultPlayMode(newGame.modes.computer);
    startPage.style.display = "none";
    markerPage.style.display = "flex";
})

markerButtons.forEach((markerButton, i) => {
    markerButton.addEventListener("click", () => {
        let marker = markerButton.classList[1].at(-1).toUpperCase();

        newGame.changeDefaultUserMarker(marker);

        markerPage.style.display = "none";
        gamePage.style.display = "flex";
    })
})