//Imported classes
import Ball from "./ball.js"
import Brick from "./brick.js"
import Data from "./data.js"
import Container from "./container.js"
import Collider from "./collisions.js"
import Dom from "./dom.js"

let scoreId;
// Global Constants
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 1000;
const HEADING_WIDTH = GAME_WIDTH;
const HEADING_HEIGHT = 64;


class Paddle {
    width;
    height;
    x;
    y;
    dx;
    dy;
    htmlElement;

    constructor(width, height, gameContainerWidth, gameContainerHeight) {
        this.width = width;
        this.height = height;
        this.x = gameContainerWidth/2 - this.width/2;
        this.y = gameContainerHeight - 1.5*this.height;
        this.htmlElement = this.setHtml();
    }

    setVelocity() {
        if (keyState["ArrowLeft"] && keyState["ArrowRight"]) {
            this.dx = 0;
            return;
        }
        if (keyState["ArrowLeft"]) {
            this.dx = -10;
            return;
        }
        if (keyState["ArrowRight"]) {
            this.dx = 10;
            return;
        }
        this.dx = 0;
    }

    setPosition() {
        this.setVelocity();
        if (this.dx < 0) {
            if (this.x > 0) {
                this.x += this.dx;
            }
            if (this.x < 0) {
                this.x = 0;
            }
        }
        if (this.dx > 0) {
            if (this.x < gameContainer.width-this.width) {
                this.x += this.dx;
            }
            if (this.x > gameContainer.width-this.width) {
                this.x = gameContainer.width-this.width;
            }
        }
    }

    setHtml() {
        let div = document.createElement("div");
        div.id = "paddle";
        div.style.position = "absolute";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        return div;
    }

    draw() {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
    }
}

class Manager {
    ball;
    lives;

}

// JS Game Objects
let gameContainer;
let headingContainer;
let ball;
let paddle;
let bricks;
let remainingBricks;
let score;
let lives;
let level;
let timeRemaining;
let frameCount;
let timer;
let started;
let paused;
let restartGame;
let time;
let collider; 
// HTML DOM objects
let dom;
let body;
let scoreData;
let levelData;
let livesData;
let timeData;

function newGame() {
    time = 0;
    restartGame = false;
    started = false;
    paused = false;
    score = 0;
    lives = 3;
    level = 0;
    scoreData = new Data("Score", score);
    levelData = new Data("Level", level);
    livesData = new Data("Lives", lives);
    timeData = new Data("Time", timeRemaining);
    collider = new Collider();
    dom = new Dom();
    body = document.getElementById("page");
    headingContainer = new Container("heading-container", HEADING_WIDTH, HEADING_HEIGHT);
    gameContainer = new Container("game-container", GAME_WIDTH, GAME_HEIGHT);
    console.log("GAME: New Game Loaded");
}

// Load & Update GameContainer, HeadingContainer
function loadNewGameDom() {
    body = document.getElementById("page");
    dom.reset(headingContainer.htmlElement);
    body.appendChild(headingContainer.htmlElement);
    dom.reset(gameContainer.htmlElement);
    body.appendChild(gameContainer.htmlElement);
    let menu = document.createElement("div");
    menu.id = "menu";
    gameContainer.htmlElement.appendChild(menu);
    let heading = document.createElement("h1");
    let headingText = document.createTextNode("BRICKBREAKER");
    heading.appendChild(headingText);
    menu.appendChild(heading);
    let para = document.createElement("h1");
    let text = document.createTextNode("To move the paddle, use the left and right arrow keys.");
    para.appendChild(text);
    menu.appendChild(para);
    let newGameButton = document.createElement("button");
    newGameButton.innerText = "Play";
    menu.appendChild(newGameButton);
    console.log("DOM: New Game Menu Loaded");
    newGameButton.addEventListener("click", () => {
        started = true;
        newLevel();
        dom.reset(headingContainer.htmlElement);
        dom.reset(gameContainer.htmlElement);
        loadNewLevelDom();
    })
}

function newLevel() {
    level++;
    levelData.htmlElement.innerText = `Level: ${level}`;
    scoreData.htmlElement.innerText = `Score: ${score}`;
    ball = new Ball(20, 420, 160);
    paddle = new Paddle(100, 20, gameContainer.width, gameContainer.height);
    switch (level) {
        case 1:
            ball = new Ball(20, 420, 160);
            bricks = initBricks(80, 20, 6, 3);
            break;
        case 2: 
            Ball.speed = 9;
            ball = new Ball(20, 420, 220);
            bricks = initBricks(80, 20, 6, 5);
            break;
        case 3: 
            Ball.speed = 10;
            ball = new Ball(20, 420, 320);
            bricks = initBricks(80, 20, 6, 7);
            break;
    }
    remainingBricks = bricks.length;
    timeRemaining = 120;
    timeData.htmlElement.innerText = `Time: ${timeRemaining}`;
    paused = false;
    console.log("GAME: New Level Loaded");
    startTimer();
    requestAnimationFrame(runLevel);
}

function loadNewLevelDom() {
    let restartDiv = document.createElement("div");
    restartDiv.classList.add("data");
    let restartIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    restartDiv.appendChild(restartIcon);
    let restartIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    restartIcon.setAttribute("fill", "white");
    restartIcon.setAttribute("stroke", "white");
    restartIcon.setAttribute("viewBox", "-3 -3 14 14");
    restartIconPath.setAttribute("d", "M4 0C1.8 0 0 1.8 0 4s1.8 4 4 4c1.1 0 2.12-.43 2.84-1.16l-.72-.72c-.54.54-1.29.88-2.13.88c-1.66 0-3-1.34-3-3s1.34-3 3-3c.83 0 1.55.36 2.09.91L4.99 3h3V0L6.8 1.19C6.08.47 5.09 0 3.99 0z");
    restartIcon.appendChild(restartIconPath);
    headingContainer.htmlElement.appendChild(restartIcon);
    headingContainer.htmlElement.appendChild(scoreData.htmlElement);
    headingContainer.htmlElement.appendChild(levelData.htmlElement);
    headingContainer.htmlElement.appendChild(livesData.htmlElement);
    headingContainer.htmlElement.appendChild(timeData.htmlElement);
    gameContainer.htmlElement.appendChild(ball.htmlElement);
    gameContainer.htmlElement.appendChild(paddle.htmlElement);
    for (const brick of bricks) {
        gameContainer.htmlElement.appendChild(brick.htmlElement);
    }
    let pauseDiv = document.createElement("div");
    pauseDiv.classList.add("data");
    let pauseIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    pauseDiv.appendChild(pauseIcon);
    let pauseIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pauseIcon.setAttribute("fill", "white");
    pauseIcon.setAttribute("stroke", "white");
    pauseIcon.setAttribute("viewBox", "-2 -2 12 12");
    pauseIconPath.setAttribute("d", "M1 1v6h2V1H1zm4 0v6h2V1H5z");
    pauseIcon.appendChild(pauseIconPath);
    headingContainer.htmlElement.appendChild(pauseIcon);
    pauseIcon.addEventListener("click", () => {
        if (started && !paused) {
            console.log("GAME: Paused");
            paused = true;
            pauseIconPath.setAttribute("d", "M1 1v6l6-3l-6-3z");
            clearTimer();
        } else if (started && paused) {
            console.log("GAME: Resumed");
            paused = false;
            pauseIconPath.setAttribute("d", "M1 1v6h2V1H1zm4 0v6h2V1H5z");
            startTimer();
        }
    });
    restartIcon.addEventListener("click", () => {
        restartGame = true;
        // timeRemaining = 0;
    })
    
    console.log("DOM: New Level Loaded");
}

function clearTimer() {
    clearInterval(timer);
}

function startTimer() {
    timeRemaining--;
    console.log(`Timer: ${timeRemaining}`);
    timeData.htmlElement.innerText = `Time: ${timeRemaining}`;
    timer = setInterval(decrementTimeRemaining, 1000);
}

function decrementTimeRemaining() {
    timeRemaining--;
    console.log(`Timer: ${timeRemaining}`);
    timeData.htmlElement.innerText = `Time: ${timeRemaining}`;
}

function runLevel() {
    if (restartGame) {
        clearTimer();
        newGame();
        dom.reset(body);
        // dom.reset(headingContainer.htmlElement);
        // dom.reset(gameContainer.htmlElement);
        loadNewGameDom();
        return;
    }
    if (!paused) {
        if (timeRemaining <= 0 || isBallDead(ball, gameContainer.height)) {
            lives--;
            livesData.htmlElement.innerText = `Lives: ${lives}`;
            if (lives <= 0) {
                console.log("Game Over");
                time += 120 - timeRemaining;
                gameOver();
                dom.reset(headingContainer.htmlElement);
                dom.reset(gameContainer.htmlElement);
                loadGameOverDomAsync();
                return;
            }
            ball.x = 200;
            ball.y = 200;
        }
        // Update Position of Ball & Paddle
        ball.setPosition();
        paddle.setPosition();
        // Calculate collisions
        collider.ballWall(ball, gameContainer.width);
        collider.ballPaddle(ball, paddle);
        // collisions.ballWallCollision(ball, gameContainer.width);
        // collisions.ballPaddleCollision(ball, paddle);
        for (const brick of bricks) {
            // if (collisions.ballBrickCollision(ball, brick)) {
            if (collider.ballBrick(ball, brick)) {
                brick.draw();
                remainingBricks--;
                score += 100;
                scoreData.htmlElement.innerText = `Score: ${score}`;
                if (remainingBricks <= 0) {
                    endLevel();
                    return;
                }
            }
        }
        // Draw Ball and Paddle
        ball.draw();
        paddle.draw();
    }
    requestAnimationFrame(runLevel);
}

function endLevel() {
    time += 120 - timeRemaining;
    clearTimer();
    dom.reset(gameContainer.htmlElement);
    loadEndLevelDom();
    console.log("GAME: Level Complete");
}

function loadEndLevelDom() {
    let menu = document.createElement("div");
    menu.id = "menu";
    gameContainer.htmlElement.appendChild(menu);
    let heading = document.createElement("h1");
    heading.innerText = "LEVEL COMPLETE";
    menu.appendChild(heading);
    let scoreDisplay = document.createElement("h1");
    let scoreText = document.createTextNode(`Score: ${score}`);
    scoreDisplay.appendChild(scoreText);
    menu.appendChild(scoreDisplay);
    let speedBonusDisplay = document.createElement("h1");
    let speedBonusText = document.createTextNode(`Speed Bonus: ${timeRemaining*10}`)
    speedBonusDisplay.appendChild(speedBonusText);
    menu.appendChild(speedBonusDisplay);
    let newGameButton = document.createElement("button");
    newGameButton.innerText = "Next Level";
    menu.appendChild(newGameButton);
    console.log("DOM: End Level Menu Loaded");
    newGameButton.addEventListener("click", () => {
        score += timeRemaining*10;
        dom.reset(headingContainer.htmlElement);
        dom.reset(gameContainer.htmlElement);
        if (level >= 3) {
            gameOver();
            loadGameOverDomAsync();
        } else {
            newLevel();
            loadNewLevelDom();
        }
    })
}

function gameOver() {
    clearTimer();
    // resetHeadingContainerDom();
    // resetGameContainerDom();
    // loadGameOverDomAsync();
}

async function loadGameOverDomAsync() {
    let menu = document.createElement("div");
    menu.id = "menu";
    gameContainer.htmlElement.appendChild(menu);
    let heading = document.createElement("h1");
    heading.innerText = "GAME OVER";
    menu.appendChild(heading);
    let scoreDisplay = document.createElement("h1");
    let scoreText = document.createTextNode(`Score: ${score}`);
    scoreDisplay.appendChild(scoreText);
    menu.appendChild(scoreDisplay);
    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = "Name";
    textInput.required = true;
    textInput.maxLength = 20;
    
    let submitButton = document.createElement("button")
    submitButton.innerText = "Submit Score";
    submitButton.addEventListener("click", async () => {

        let data = {
            name: textInput.value,
            score: score,
            time: time
        };
        let res = await postScoreAsync(data);
        scoreId = await res.json();
        await highScores(data);
    })
    menu.appendChild(textInput);
    menu.appendChild(submitButton);

    textInput.focus();
    textInput.select();
}

async function highScores() {
    let output = await getHighScoresAsync();
    
    // console.log("Congrats ");
    loadHighScoresDom(output);
}

function loadHighScoresDom(data, startIdx = 0) {
    let ss;
    let sp;
    let sq;
    console.log(scoreId);
    for (const s of data) {
        if (s.ID == scoreId) {
            console.log("Match found!");
            ss = s.Score;
            sp = s.Percentile;
            sq = s.Rank;
            break;
        }
    }
    let endIdx = startIdx + 5;
    if (endIdx > data.length) {
        endIdx = data.length;
    }
    dom.reset(gameContainer.htmlElement);
    let menu = document.createElement("div");
    menu.id = "menu";
    gameContainer.htmlElement.appendChild(menu);
    let randomScoreThing = document.createElement("p");
    let rstText = document.createTextNode(`Your score of ${ss} ranks you #${sq} - the top ${sp}%`);
    randomScoreThing.appendChild(rstText);
    menu.appendChild(randomScoreThing);
    let heading = document.createElement("h1");
    let headingText = document.createTextNode("HIGH SCORES");
    heading.appendChild(headingText);
    menu.appendChild(heading);
    let table = document.createElement("table");
    menu.appendChild(table);
    let thead = document.createElement("thead");
    table.appendChild(thead);
    let th0 = document.createElement("th");
    th0.innerText = "Rank";
    thead.appendChild(th0);
    let th1 = document.createElement("th");
    th1.innerText = "Name";
    thead.appendChild(th1);
    let th2 = document.createElement("th");
    th2.innerText = "Score";
    thead.appendChild(th2);
    let th3 = document.createElement("th");
    th3.innerText = "Time";
    thead.appendChild(th3);
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = startIdx; i < endIdx; i++) {
        let item = data[i];
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        let rank = document.createElement("td");
        rank.innerText = item.Rank;
        let name = document.createElement("td");
        name.innerText = item.Name;
        let score = document.createElement("td");
        score.innerText = item.Score;
        let time = document.createElement("td");
        time.innerText = item.Time;
        tr.appendChild(rank);
        tr.appendChild(name);
        tr.appendChild(score);
        tr.appendChild(time);
    }
    let span = document.createElement("span");
    menu.appendChild(span);
    if (startIdx > 0) {
        let prevBtn = document.createElement("button");
        span.appendChild(prevBtn);
        prevBtn.innerText = "<-";
        prevBtn.addEventListener("click", () => {
            loadHighScoresDom(data, startIdx-5);
        });
    }
    if (endIdx < data.length) {
        let nextBtn = document.createElement("button");
        span.appendChild(nextBtn);
        nextBtn.innerText = "->";
        nextBtn.addEventListener("click", () => {
            loadHighScoresDom(data, startIdx+5);
        });
    }
    let playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again";
    menu.appendChild(playAgainButton);
    playAgainButton.addEventListener( "click", () => {
        newGame();
        dom.reset(body);
        loadNewGameDom();
    })
}

async function postScoreAsync(data) {
    let res = await fetch("http://localhost:8080/api/score", {
        method: "POST",
        body: JSON.stringify(data)
    });
    return res;
}

async function getHighScoresAsync() {
    let res = await fetch("http://localhost:8080/api/highscores", {
        method: "GET",
    });

    let output = await res.json();
    return output;
}

let keyState = {};

// window.addEventListener("load", () => {
//     console.log("Page Load - Should only happen once!")
//     newGame();
//     dom.reset(body);
//     loadNewGameDom();
// })

function initBricks(width, height, cols, rows) {
    let gapCount = cols+1;
    let gapWidth = (gameContainer.width-cols*width)/gapCount;
    let bricks = [];
    for (let i = 1; i <= cols; i++) {
        for (let j = 0; j < rows; j++) {
            let brick = new Brick(width, height, gapWidth*i + (i-1)*width, j*(height*2.5));
            bricks.push(brick);
        }
    }
    return bricks;
}

function isBallDead(ball, gameContainerHeight) {
    if (ball.y >= gameContainerHeight-ball.diameter) {
        ball.y = gameContainerHeight-ball.diameter;
        return true;
    }
    return false;
}

// Event Listeners
window.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowLeft":
            keyState["ArrowLeft"] = true;
            console.log("Key Down: Left");
            break;
        case "ArrowRight":
            keyState["ArrowRight"] = true;
            console.log("Key Down: Right");
            break;
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            keyState["ArrowLeft"] = false;
            break;
        case "ArrowRight":
            keyState["ArrowRight"] = false;
            break;
    }
})

console.log("Page Load - Should only happen once!")
newGame();
dom.reset(body);
loadNewGameDom();
