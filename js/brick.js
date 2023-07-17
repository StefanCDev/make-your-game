export default class Brick {
    width;
    height;
    x;
    y;
    active;
    htmlElement;
    //gimme strength

    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.active = true;
        this.htmlElement = this.setHtml();
    }

    setHtml() {
        let div = document.createElement("div");
        div.classList.add("brick");
        div.style.position = "absolute";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        return div;
    }

    draw() {
        if (this.active) {
            this.htmlElement.style.display = "block";
        } else {
            this.htmlElement.style.display = "none";
        }
    }
}