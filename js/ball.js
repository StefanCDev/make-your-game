export default class Ball {
    static id = "ball";
    static speed = 8;
    diameter;
    x;
    y;
    dx;
    dy;
    htmlElement;

    constructor(diameter, x, y) {
        this.diameter = diameter;
        this.x = x;
        this.y = y;
        this.dx = Ball.speed * Math.sin(0.5);
        this.dy = Ball.speed * Math.cos(0.5);
        this.htmlElement = this.setHtml();
    }

    setPosition() {
        this.x += this.dx;
        this.y += this.dy;
    }

    setHtml() {
        let div = document.createElement("div");
        div.id = "ball";
        div.style.position = "absolute";
        div.style.width = this.diameter + "px";
        div.style.height = this.diameter + "px";
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        return div;
    }

    draw() {
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
    }
}