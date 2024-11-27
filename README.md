
Brickbreaker Game
This project is a Brickbreaker game built with JavaScript and HTML, designed to run at a smooth 60 FPS, utilizing performance optimization techniques and basic DOM manipulation. The game follows the classic Arkanoid/ Brickbreaker concept, where the player controls a paddle to bounce a ball and break bricks.

Additionally, the scoreboard and performance monitoring are implemented in Go, making it a full-stack game project.

Features
Gameplay
Smooth 60 FPS: The game runs at a constant 60 frames per second with no frame drops, using the requestAnimationFrame API to ensure smooth animation.
Pause Menu: The game includes a pause menu with the following options:
Continue the game.
Restart the game.
Scoreboard: Displays the current:
Score: Tracks points earned during the game.
Lives: Shows the number of lives left.
Timer: A countdown clock indicating the time remaining in the game or the duration for which the game has been running.
Performance Monitoring
The game is built with performance in mind, with constant monitoring to ensure the FPS remains consistent.
Developer tools are used for performance tracking, checking for any potential frame drops, and optimizing rendering performance.
Controls
Keyboard: The game is controlled using the keyboard.
Smooth motion when keys are pressed (no need to spam keys).
Actions are triggered and continue while the key is held down.
Technologies Used
Frontend: JavaScript, HTML, and DOM (No frameworks or canvas).
Backend (Scoreboard): Go (Golang) for handling and storing the scoreboard.
Setup
Clone the repository:


git clone https://github.com/StefanCDev/brickbreaker-game.git
Remove the Scoreboard from the Parent Directory:

The scoreboard code is implemented in a separate directory and should be removed from the parent directory before running the game.

To run the game:

Open the index.html file in your browser after the scoreboard has been removed.
Backend (Scoreboard) Setup:

Make sure Go is installed on your machine.
Clone the backend repository from: Brickbreaker Scoreboard.
Follow the instructions in the Go repository to set up and run the scoreboard before starting the JavaScript game.
Alternatively you can run the game without scoreboard using this link: https://illustrious-souffle-aae250.netlify.app/

For development:

Open the project in your code editor (VS Code recommended).
Use browser Developer Tools to inspect performance and ensure FPS optimization.
Game Instructions
The player controls a paddle at the bottom of the screen, moving it left and right to bounce a ball and break the bricks above.
The objective is to break all the bricks without letting the ball fall off the screen.
You have a limited number of lives. Once you lose all your lives, the game ends.
During the game, you can pause, restart, or continue by using the Pause Menu.
Developer Tools
To analyze performance, you can use the Developer Tools available in most modern browsers:

Page Inspector: View and edit the page content and layout.
Web Console: See logs and interact with the page using JavaScript.
Performance Tool: Analyze the FPS, check for frame drops, and monitor function performance.
Contribution
If you'd like to contribute to this project:

Fork the repository.
Create a feature branch: git checkout -b feature-branch.
Commit your changes: git commit -m 'Add feature'.
Push to the branch: git push origin feature-branch.
Open a pull request.
License
This project is licensed under the MIT License.

Credits
Game concept inspired by BrickBreaker/Arkanoid.
Backend scoreboard powered by Go.
