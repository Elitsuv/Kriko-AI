let gameCount = 0;
        let isGameLocked = false;
        let currentPrompt = null;
        let gameState = null;

        function inputValidation(validOptions) {
            return new Promise(resolve => {
                currentPrompt = { validOptions, resolve };
            });
        }

        function pToss() {
            return new Promise(resolve => {
                currentPrompt = {
                    validOptions: [1, 2],
                    resolve: choice => resolve(choice === 1 ? ["Batting", "Bowling"] : ["Bowling", "Batting"])
                };
                addMessage("AI", "Type '1' to bat first or '2' to bowl first");
            });
        }

        function cToss() {
            let computerChoice = Math.random() < 0.5 ? "Batting" : "Bowling";
            return [computerChoice === "Batting" ? "Bowling" : "Batting", computerChoice];
        }

        function getAIMove(data, isBatting = true) {
            if (data.length > 3) {
                const movesCount = new Array(7).fill(0);
                data.forEach(move => movesCount[move]++);
                
                if (isBatting) {
                    let mostFrequent = 1;
                    for (let i = 2; i <= 6; i++) {
                        if (movesCount[i] > movesCount[mostFrequent]) {
                            mostFrequent = i;
                        }
                    }
                    const safeMoves = [1, 2, 3, 4, 5, 6].filter(m => m !== mostFrequent);
                    return safeMoves[Math.floor(Math.random() * safeMoves.length)];
                } else {
                    let maxCount = movesCount[1];
                    let mostFrequent = 1;
                    for (let i = 2; i <= 6; i++) {
                        if (movesCount[i] > maxCount) {
                            maxCount = movesCount[i];
                            mostFrequent = i;
                        }
                    }
                    return mostFrequent;
                }
            }
            return Math.floor(Math.random() * 6) + 1;
        }

        async function playHacricko() {
            if (gameCount >= 2) {
                isGameLocked = true;
                addMessage("AI", "Game limit reached! Please download the real game to continue playing.");
                document.getElementById("sendButton").disabled = true;
                return;
            }

            addMessage("AI", "Hacricko Version 2.0.0\n---Menu---\n1. To start new game\n2. See previous Scores\n3. Exit");
            let menuChoice = await inputValidation([1, 2, 3]);

            if (menuChoice === 1) {
                gameCount++;
                addMessage("AI", "coach 🧢: Type '1' if you want to start or '2' if you want computer to start");
                let gameChoice = await inputValidation([1, 2]);

                let playerDecision, computerDecision;
                if (gameChoice === 1) {
                    [playerDecision, computerDecision] = await pToss();
                } else {
                    [computerDecision, playerDecision] = cToss();
                    addMessage("AI", `Computer chose to ${computerDecision}`);
                }

                addMessage("AI", "coach 🧢: For how many wickets do you want to play?\nChoose between 1 to 5 wickets");
                let wickets = await inputValidation([1, 2, 3, 4, 5]);

                gameState = {
                    playerScore: [],
                    computerScore: [],
                    playerWickets: 0,
                    compWickets: 0,
                    playerRuns: 0,
                    compRuns: 0,
                    playerMoves: [],
                    computerMoves: [],
                    wickets,
                    playerDecision,
                    computerDecision,
                    phase: playerDecision === "Batting" ? "playerBatting" : "computerBatting"
                };

                addMessage("AI", "Starting Game");
                playNextMove();
            } else if (menuChoice === 2) {
                addMessage("AI", "Feature to view previous scores is not implemented yet.");
                playHacricko();
            } else {
                addMessage("AI", "Exiting the program. Goodbye!");
            }
        }

        async function playNextMove() {
            if (!gameState) return;

            const { playerWickets, compWickets, playerRuns, compRuns, wickets, phase, playerMoves, computerMoves } = gameState;

            if (phase === "playerBatting" && playerWickets < wickets) {
                addMessage("AI", "Enter your batting move (1-6):");
                let player = await inputValidation([1, 2, 3, 4, 5, 6]);
                playerMoves.push(player);
                let computer = getAIMove(playerMoves, false);
                computerMoves.push(computer);
                addMessage("AI", `Computer 🤖: ${computer}`);

                if (player === computer) {
                    addMessage("AI", "Out!");
                    gameState.playerWickets++;
                } else {
                    gameState.playerRuns += player;
                    gameState.playerScore.push(player);
                    addMessage("AI", `runs: ${gameState.playerRuns}`);
                }

                if (gameState.playerWickets === wickets) {
                    addMessage("AI", "Player is all out! Computer's turn.");
                    addMessage("AI", "coach 🧢: Better luck next time champ!");
                    gameState.phase = "computerBatting";
                }
            } else if (phase === "computerBatting" && compWickets < wickets && compRuns <= playerRuns) {
                addMessage("AI", "Enter your bowling move (1-6):");
                let player = await inputValidation([1, 2, 3, 4, 5, 6]);
                playerMoves.push(player);
                let computer = getAIMove(playerMoves, true);
                computerMoves.push(computer);
                addMessage("AI", `Computer 🤖: ${computer}`);

                if (player === computer) {
                    addMessage("AI", "Out!");
                    gameState.compWickets++;
                } else {
                    gameState.compRuns += computer;
                    gameState.computerScore.push(computer);
                    addMessage("AI", `runs: ${gameState.compRuns}`);
                }

                if (gameState.compRuns > gameState.playerRuns) {
                    addMessage("AI", "Computer won!");
                    addMessage("AI", "coach 🧢: Better luck next time champ!");
                    endGame();
                    return;
                }
                if (gameState.compWickets === wickets) {
                    addMessage("AI", "Computer is all out! Player Won.");
                    addMessage("AI", "coach 🧢: Good game champ!");
                    endGame();
                    return;
                }
            }

            if (gameState.playerRuns === gameState.compRuns && phase === "computerBatting") {
                addMessage("AI", "It's a tie!\ncoach 🧢: Super Over!");
                await playSuperOver();
                endGame();
                return;
            }

            playNextMove();
        }

        async function playSuperOver() {
            let superState = {
                playerScore: [],
                computerScore: [],
                playerWickets: 0,
                compWickets: 0,
                playerRuns: 0,
                compRuns: 0,
                wickets: 1
            };

            addMessage("AI", "Type '1' to bat first or '2' to bowl first in Super Over");
            let gameChoice = await inputValidation([1, 2]);
            let playerDecision = gameChoice === 1 ? "Batting" : "Bowling";

            if (playerDecision === "Batting") {
                while (superState.playerWickets < superState.wickets) {
                    addMessage("AI", "Enter your batting move (1-6):");
                    let player = await inputValidation([1, 2, 3, 4, 5, 6]);
                    gameState.playerMoves.push(player);
                    let computer = getAIMove(gameState.playerMoves, false);
                    gameState.computerMoves.push(computer);
                    addMessage("AI", `Player 🧑: ${player}, Computer 🤖: ${computer}`);

                    if (player === computer) {
                        addMessage("AI", "Out!");
                        superState.playerWickets++;
                    } else {
                        superState.playerRuns += player;
                        superState.playerScore.push(player);
                        addMessage("AI", `runs: ${superState.playerRuns}`);
                    }

                    if (superState.playerWickets === superState.wickets) {
                        addMessage("AI", `Player is all out! Computer's turn.\nTarget for Computer: ${superState.playerRuns + 1}`);
                        break;
                    }
                }

                while (superState.compWickets < superState.wickets && superState.compRuns <= superState.playerRuns) {
                    addMessage("AI", "Enter your bowling move (1-6):");
                    let player = await inputValidation([1, 2, 3, 4, 5, 6]);
                    gameState.playerMoves.push(player);
                    let computer = getAIMove(gameState.playerMoves, true);
                    gameState.computerMoves.push(computer);
                    addMessage("AI", `Player 🧑: ${player}, Computer 🤖: ${computer}`);

                    if (player === computer) {
                        addMessage("AI", "Out!");
                        superState.compWickets++;
                    } else {
                        superState.compRuns += computer;
                        superState.computerScore.push(computer);
                        addMessage("AI", `runs: ${superState.compRuns}`);
                    }

                    if (superState.compRuns > superState.playerRuns) {
                        addMessage("AI", "Computer won the Super Over!\ncoach 🧢: Better luck next time champ!");
                        return;
                    }
                    if (superState.compWickets === superState.wickets) {
                        addMessage("AI", "Computer is all out! Player Won the Super Over.\ncoach 🧢: Good game champ!");
                        return;
                    }
                }
            } else {
                while (superState.compWickets < superState.wickets) {
                    addMessage("AI", "Enter your bowling move (1-6):");
                    let player = await inputValidation([1, 2, 3, 4, 5, 6]);
                    gameState.playerMoves.push(player);
                    let computer = getAIMove(gameState.playerMoves, true);
                    gameState.computerMoves.push(computer);
                    addMessage("AI", `Player 🧑: ${player}, Computer 🤖: ${computer}`);

                    if (player === computer) {
                        addMessage("AI", "Out!");
                        superState.compWickets++;
                    } else {
                        superState.compRuns += computer;
                        superState.computerScore.push(computer);
                    }

                    if (superState.compWickets === superState.wickets) {
                        addMessage("AI", `Computer is all out! Player's turn.\nTarget for Player: ${superState.compRuns + 1}`);
                        break;
                    }
                }

                while (superState.playerWickets < superState.wickets && superState.playerRuns <= superState.compRuns) {
                    addMessage("AI", "Enter your batting move (1-6):");
                    let player = await inputValidation([1, 2, 3, 4, 5, 6]);
                    gameState.playerMoves.push(player);
                    let computer = getAIMove(gameState.playerMoves, false);
                    gameState.computerMoves.push(computer);
                    addMessage("AI", `Player 🧑: ${player}, Computer 🤖: ${computer}`);

                    if (player === computer) {
                        addMessage("AI", "Out!");
                        superState.playerWickets++;
                    } else {
                        superState.playerRuns += player;
                        superState.playerScore.push(player);
                    }

                    if (superState.playerRuns > superState.compRuns) {
                        addMessage("AI", "Player won the Super Over! 🏆\ncoach 🧢: Good game champ!");
                        return;
                    }
                    if (superState.playerWickets === superState.wickets) {
                        addMessage("AI", "Player is all out! Computer Won the Super Over.\ncoach 🧢: Better luck next time champ!");
                        return;
                    }
                }
            }
        }

        function endGame() {
            addMessage("AI", `--Final Stats--\nPlayer: ${gameState.playerRuns}/${gameState.playerWickets}\nComputer: ${gameState.compRuns}/${gameState.compWickets}`);
            gameState = null;
            playHacricko();
        }

        function addMessage(sender, text) {
            const chatMessages = document.getElementById("chatMessages");
            const messageDiv = document.createElement("div");
            messageDiv.className = `message ${sender.toLowerCase()}`;
            
            if (sender === "AI") {
                const avatarDiv = document.createElement("div");
                avatarDiv.className = "ai-avatar";
                const img = document.createElement("img");
                img.src = "ki.jpg"; // Replace with your PNG URL
                avatarDiv.appendChild(img);
                messageDiv.appendChild(avatarDiv);
            }

            const contentDiv = document.createElement("div");
            contentDiv.className = "message-content";
            contentDiv.textContent = text;
            messageDiv.appendChild(contentDiv);

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        document.getElementById("sendButton").addEventListener("click", () => {
            const input = document.getElementById("userInput");
            const message = input.value.trim();
            if (message && !isGameLocked) {
                addMessage("User", message);
                input.value = "";
                if (currentPrompt) {
                    const num = parseInt(message);
                    if (currentPrompt.validOptions.includes(num)) {
                        currentPrompt.resolve(num);
                        currentPrompt = null;
                    } else {
                        addMessage("AI", "Invalid input! Please choose from: " + currentPrompt.validOptions.join(", "));
                    }
                }
            }
        });

        document.getElementById("userInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                document.getElementById("sendButton").click();
            }
        });

        // Start the game
        playHacricko();