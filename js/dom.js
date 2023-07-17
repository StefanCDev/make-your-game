export default class Dom {

    reset(element) {
        element.innerHTML = "";
        console.log(`DOM: ${element.id} Reset`);
    }

    newGame(body, headingElement, gameElement) {
        // body = document.getElementById("page");
        body.appendChild(headingElement);
        body.appendChild(gameElement);
        let menu = document.createElement("div");
        menu.id = "menu";
        gameElement.appendChild(menu);
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
            this.reset(headingElement);
            this.reset(gameElement);
            loadNewLevelDom();
        })
    }
}