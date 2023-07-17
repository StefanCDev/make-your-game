export default class Container {
    // Properties
    id;
    width;
    height;
    // htmlElement;
    // Constructor
    constructor(id, width, height) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.htmlElement = this.setHtml();
    }

    setHtml() {
        let div = document.createElement("div");
        div.id = this.id;
        div.style.position = "relative";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        return div;
    }

}