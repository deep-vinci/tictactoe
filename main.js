
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

    function checkForWins() {
        let winSequence = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
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
        return { markers, board, printBoard, user, enterUserChoice, checkForWins }
}


let newGame = gameBoard();
newGame.printBoard();
// newGame.enterUserChoice(0);

function temporaryUserInputShortener (userMarker, index) {
    if (newGame.board[index-1] == "-") {
        console.log(`User ${userMarker} choice`);
        newGame.enterUserChoice(newGame.user(userMarker, index-1))
        newGame.printBoard();    
    } else {
        console.error("Already choosen")
    }
}
let i = 0;
// newGame.checkForWins();
while (true) {
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

    } else {
        i++
        console.log("user o choice")
        newGame.enterUserChoice(newGame.user("O", userChoiceIndex))
        console.log(newGame.checkForWins().status)
        // console.log(newGame.checkForWins())
        newGame.printBoard();    
    }
    if (i == 9) {
        break;
    }

}

// for (let i = 0; i < 9; i++) {
//     if (i%2 === 0) {
//         let index = prompt("x");
//         temporaryUserInputShortener("X", index);
//     } else {
//         let index = prompt("O");
//         temporaryUserInputShortener("O", index);
//     }
// }

// for the ui you most likely just need