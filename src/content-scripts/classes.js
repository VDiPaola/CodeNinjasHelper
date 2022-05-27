import {Dictionary, tags} from "./dictionary";

export class Editor {

    static init(){
        this.sendMessage({message: "init"});
    }

    static setCommandBindingsOn(value){
        this.sendMessage({message: "setCommandBindingsOn", value:value});
    }


    static setTheme(theme) {
        this.sendMessage({message: "setTheme", value: theme});
    }

    static setValue(text, position, resetUndoHistory=false){
        this.sendMessage({message: "setValue", value: text, position, resetUndoHistory});
    }

    static async insertText(text){
        return await this.sendMessage({message: "insertText", value: text});
    }

    static setFontSize(fontSize){
        this.sendMessage({message: "setFontSize", value: fontSize});
    }

    static setTabSize(tabSize){
        this.sendMessage({message: "setTabSize", value: tabSize});
    }

    static replaceInRange(value, startRow, startColumn, endRow, endColumn){
        this.sendMessage({message: "replaceInRange", value, startRow, startColumn, endRow, endColumn});
    }

    static moveCursorTo(row, column){
        this.sendMessage({message: "moveCursorTo", value: row, column});
    }

    static async getIntellisenseData(){
        return await this.sendMessage({message: "getIntellisenseData"});
    }

    static async getCurrentLine(){
        return await this.sendMessage({message: "getCurrentLine"});
    }

    static async getCurrentWord(){
        return await this.sendMessage({message: "getCurrentWord"});
    }

    static async getCursor(){
        return await this.sendMessage({message: "getCursor"});
    }

    static async sendMessage(data){
        data = {type:"intellisense", ...data};
        return await chrome.runtime.sendMessage(data)
    }
}

export class Intellisense {
    constructor(){
        //create container div
        this.container = document.createElement("div");
        this.container.className = "CodeNinjasHelper";
        document.body.appendChild(this.container);

        //get offset position of the editor
        const rect = document.getElementsByClassName("ace_text-input")[0].getBoundingClientRect();
		this.offsetX = rect.x;
		this.offsetY = rect.top;

        
        this.caseSensitive = false; //case sensitive for checking intellisense
        this.currentlySelectedKey = null; //currently selected Dictionary key
        this.currentlySelectedIndex = 0;
    }

    onUpArrow(){
        if(this.currentlySelectedIndex > 0){
            this.currentlySelectedIndex--;
            this.updateSelected();
        }
    }

    onDownArrow(){
        if(this.currentlySelectedIndex < this.container.children.length - 1){
            this.currentlySelectedIndex++;
            this.updateSelected();
        }
    }

    updateSelected(){
        //clear all selected
        for(let i = 0; i < this.container.children.length; i++){
            this.container.children[i].classList.remove("selected");
        }
        //select current
        this.container.children[this.currentlySelectedIndex].classList.add("selected");
    }

    show(cursorPos, textAreaEl){
        if(this.container.children.length > 0){
            //position container
            const rect = textAreaEl.getBoundingClientRect();
            this.container.style.top = ((cursorPos.row + 1) * rect.height) + this.offsetY + "px";
            this.container.style.left = ((cursorPos.column) * rect.width) + this.offsetX + "px";
            //show
            this.container.style.display = "flex";

            Editor.setCommandBindingsOn(false);
        }
    }

    hide(){
        if(this.container.children.length > 0){
            //clear and hide div
            this.container.innerHTML = "";
            this.container.style.display = "none";
            //reset selected
            this.currentlySelectedIndex = 0;
            
            Editor.setCommandBindingsOn(true);
        }
    }

    isVisible(){
        return this.container.style.display !== "none";
    }

    check = (curWord, cursorPos, textAreaEl) => {
        this.hide();


        //lookup word in dictionary
        const keys = Object.keys(Dictionary);
        for(let key of keys){
            let startsWith = this.caseSensitive ? key.startsWith(curWord) : key.toLowerCase().startsWith(curWord.toLowerCase());
            if(startsWith){
                this.append(key, curWord.length, textAreaEl);
            }
        }

        this.show(cursorPos, textAreaEl);
    }

    append = (key, inputLength, textAreaEl) => {
        //create intellisense entry
        let newDiv = document.createElement("div");
        let newSpan = document.createElement("span");
        let newSpan2 = document.createElement("span");

        newSpan.textContent = key;
        newSpan2.textContent = this.filterDictValue(Dictionary[key]);
        newDiv.appendChild(newSpan);
        newDiv.appendChild(newSpan2);

        newDiv.setAttribute("value", key);
        newDiv.setAttribute("inputLength", inputLength);

        //submit on click
        newDiv.addEventListener("click", (e)=>{
            this.submit(e.target)
            textAreaEl.focus();
        });
        //select on hover
        newDiv.addEventListener("mouseover", (e)=>{
            this.currentlySelectedIndex = [...e.target.parentElement.children].indexOf(e.target);
            this.updateSelected();
        });


        //append and add class
        if(this.container.children.length === 0) newDiv.classList.add("selected");
        this.container.appendChild(newDiv);
    }

    filterDictValue = (value) => {
        let returnValue = value;
        for(let tag of tags){
            returnValue = returnValue.replace(tag, "");
        }
        return returnValue;
    }


    submit = (el) => {
        //insert text in editor
        const key = el.getAttribute("value");
        let text = Dictionary[key];

        if(text){
            //get text without key in it
            const inputLength = parseInt(el.getAttribute("inputLength"));
	        text = text.slice(inputLength);
            Editor.insertText(text)
        }
        
        //hide
        this.hide();
    }

}