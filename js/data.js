export default class Data {
    label;
    value;
    htmlElement;

    constructor(label, value) {
        this.label = label;
        this.value = value;
        this.htmlElement = this.setHtml();
    }

    setHtml() {
        let result = document.createElement("div");
        result.classList.add("data");
        result.innerText = `${this.label}: ${this.value}`;
        return result;
    }
}
