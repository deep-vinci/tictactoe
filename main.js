let withComputer = document.querySelector(".with-computer")
let withAFriend = document.querySelector(".with-a-friend")

let gameBoardContainer = document.querySelector(".game-board-container");
let gameBoardDivs = document.querySelectorAll(".game-cell");
let restartButton = document.querySelector(".game-restart");
let endGame = document.querySelector(".game-end");

let startPage = document.querySelector(".start-page");
let markerPage = document.querySelector(".marker-page");
let gamePage = document.querySelector(".game-page");

let markerButtons = document.querySelectorAll(".marker-button");


function gameBoard () {
    // const USER_X = {
        //     user: "X",
    //     marker: "X"
    // }
    let markers = {
        x: "X",
        o: "O",
        placeholder: 1
    }
    let modes = {
        player: "player",
        computer: "computer"
    }

    let svg = {
        x: `<svg width="100" height="100" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.058 9.95032L45.8789 46.0084M45.8789 46.0084L79.8292 81.1649M45.8789 46.0084L81.0355 12.058M45.8789 46.0084L9.82083 80.8292" stroke="white" stroke-width="26"/>
        </svg>`,
        o: `<svg width="100" height="100" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="45" cy="45" r="32" stroke="white" stroke-width="26"/>
        </svg>`
    }
    let defaultUserMarker = markers.x;
    let defaultplayMode = "";
    let board = new Array(9).fill(markers.placeholder)
    
    
    // hacky part to print the board thats decipherable in console
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
        return {
            mode
        }
    }
    function changeDefaultUserMarker(marker) {
        defaultUserMarker = marker;
        console.warn(defaultUserMarker)
    }

    function user(marker, index) {
        return { 
            user: marker,
            marker,
            index,
        }
    }
    
    function enterUserChoice(userObject) {
        // board[indexOfBoard] = "x";
        board[userObject.index] = userObject.marker;
    }
    
    function displayWinner(winnerObj) {
        // display winner sequence on ui
        winnerObj.sequence.forEach((e, i) => {
            // console.log(gameBoardDivs[e])
            gameBoardDivs[e].classList.add("game-cell-wins");
        })
        gameBoardContainer.classList.add("pointer-events-none")
        console.log(winnerObj);
    }
    
    function displayTheMarkers (div, svg) {
        div.innerHTML = svg;
    }
    
    function checkForWins() {
        // console.log(defaultUserMarker)
        let winSequence = [
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
                            displayWinner( {
                                status: 1,
                                winner: board[singleSequence[i2]],
                                sequence: singleSequence
                            });
                            return {
                                status: 1,
                                winner: board[singleSequence[i2]],
                                sequence: singleSequence
                            };
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

    function friendMode () {
        
    }
    function computerMode () {
        console.log("computerMode")
    }
    
    function match(div) {
        console.log();
    }
    
    function startGame () {
        let index = 0;
        
        gameBoardDivs.forEach((gameBoardDiv, i) => {
            gameBoardDiv.addEventListener("click", () => {
                // match(gameBoardDiv);
                let userChoiceIndex = parseInt(gameBoardDiv.classList[0].at(-1));
                if (board[userChoiceIndex] != markers.placeholder) {
                    console.error("skipped")
                    return;
                } 
                
                if (index%2 == 0) {
                    // console.log(gameBoardDiv)
                    // first game is always by the player 1 so nothing out of normal just put the x on the cell
                    // update the map
                    enterUserChoice(user(defaultUserMarker, userChoiceIndex))
                    printBoard();
                    displayTheMarkers(gameBoardDiv, svg.x);
                    
                    let winObj = checkForWins();
                    console.log(winObj.status)
                    if (winObj.status == 1) {
                        console.log("WIN")
                    } else {
                        console.log("NO WIN")
                    }
                    // check for wins()
                    index++;
                } else {
                    // console.log(gameBoardDiv)
                    // user 2
                    // for second game, check the mode if it is comp then let the comp choose random 
                    // choice form the available cells 
                    // update the map
                    let nonDefaultUserMarker = (defaultUserMarker == markers.x) ? markers.o : markers.x;
                    enterUserChoice(user(nonDefaultUserMarker, userChoiceIndex))
                    printBoard();
                    displayTheMarkers(gameBoardDiv, svg.o);
                    
                    let winObj = checkForWins();
                    console.log(winObj.status)
                    if (winObj.status == 1) {
                        console.log("WIN")
                    } else {
                        console.log("NO WIN")
                    }
                    // check for wins()
                    index++;
                }
            })
        })
        // if (playerMode == modes.computer) {
            //     computerMode();
            // } else {
        //     friendMode()
        // }
    }
    return { markers, board, defaultplayMode, modes, changeDefaultPlayMode, printBoard, user, enterUserChoice, checkForWins, startGame, changeDefaultUserMarker }
}


// newGame.printBoard();
// newGame.enterUserChoice(0);

// let i = 0;
// newGame.checkForWins();
while (false) {
    let userChoiceIndex = prompt("Enter the choice");
    if (newGame.board[userChoiceIndex] != newGame.markers.placeholder) {
        console.error("skipped")
        continue;
    } 
    if (i%2 == 0) {
        i++
        console.log("user x choice")
        newGame.enterUserChoice(newGame.user("X", userChoiceIndex))
        console.log(newGame.checkForWins().status)
        // console.log(newGame.checkForWins())
        newGame.printBoard();    
        if (newGame.checkForWins().status == 1) {
            break;
        }

    } else {
        i++
        // can do comp choice
        console.log("user o choice")
        newGame.enterUserChoice(newGame.user("O", userChoiceIndex))
        console.log(newGame.checkForWins().status)
        // console.log(newGame.checkForWins())
        
        newGame.printBoard();    
        if (newGame.checkForWins().status == 1) {
            break;
        }
    }
    if (i == 9) {
        console.log("tie")
        break;
    }

}
let newGame = gameBoard();
newGame.changeDefaultPlayMode(newGame.modes.computer);
newGame.startGame();


restartButton.addEventListener("click", () => {
    location.reload()
})

endGame.addEventListener("click", () => {
    console.log("end game")
})

withComputer.addEventListener("click", () => {
    startPage.style.display = "none";
    markerPage.style.display = "flex";
})

markerButtons.forEach((markerButton, i) => {
    markerButton.addEventListener("click", () => {
        let marker = markerButton.classList[1].at(-1).toUpperCase();
        // let marker = (markerButton.classList[1].at(-1) == newGame.markers.o.toLowerCase() ? "");
        newGame.changeDefaultUserMarker(marker);
        console.log(marker)
        markerPage.style.display = "none";
        gamePage.style.display = "flex";
        // console.log()
    })
})

// let newGame = gameBoard();
// newGame.changePlayMode(newGame.modes.computer)

// console.log(newGame.playerMode)
// let index = 0

// gameBoardDivs.forEach((gameBoardDiv, i) => {
    //     gameBoardDiv.addEventListener("click", () => {
        //         if (index != 0) return;
        //         newGame.startGame();
        //         index++;
        //     })
        // })