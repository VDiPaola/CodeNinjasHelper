const Dictionary = {
    "if": "if ([cursor]) {\n\n}",
	"else": "else {\n[cursor]\n}",
	"function": "function ([cursor]) {\n\n}",
    "isKeyPressed": "isKeyPressed(Keys.[cursor])",
}
const tags = ["[cursor]", "[tab]", "[highlightStart]", "[highlightEnd]"];
class Editor {

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
        data = {type:"ace", ...data};
        return await chrome.runtime.sendMessage(data)
    }
}

class Intellisense {
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

    show(cursorPos, textAreaEl){
        if(this.container.children.length > 0){
            //position container
            const rect = textAreaEl.getBoundingClientRect();
            this.container.style.top = ((cursorPos.row + 1) * rect.height) + this.offsetY + "px";
            this.container.style.left = ((cursorPos.column) * rect.width) + this.offsetX + "px";
            //show
            this.container.style.display = "flex";

            Editor.setCommandBindingsOn(false);
        };
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
        
        //lookup word in dictionary
        if(Dictionary.hasOwnProperty(curWord)){
            //append
            this.append(curWord);
            //show
            this.show(cursorPos, textAreaEl);
        }
    }

    append = (key) => {
        //create intellisense entry
        let newDiv = document.createElement("div");
        let newSpan = document.createElement("span");
        let newSpan2 = document.createElement("span");

        newSpan.textContent = key;
        newSpan2.textContent = this.filterDictValue(Dictionary[key]);
        newDiv.appendChild(newSpan);
        newDiv.appendChild(newSpan2);

        newDiv.setAttribute("value", key);

        newDiv.addEventListener("click", (e)=>{this.submit(e.target)});

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
	        text = text.slice(key.length);
            Editor.insertText(text).then(res=>console.log(res))
        }
        
        //hide
        this.hide();
    }

}
window.addEventListener("load", async () => {
    //wait for editor to load
    waitForElement(".ace_text-input").then(() => {
        //setup objects
        const intellisense = new Intellisense();
        Editor.init();
        Editor.setTheme("ace/theme/twilight");

        window.addEventListener("click", ()=>{
            Editor.getCursor().then(res => console.log(res));
        })

        window.addEventListener("keydown", function(e){
            const el = e.target;
            //check for enter press
            if(e.code == "Enter" && intellisense.isVisible() && intellisense.container.children.length > 0){
                //insert intellisense if available
                e.preventDefault();
                intellisense.submit(intellisense.container.children[0]);
            }else if(el.tagName == "TEXTAREA" || el.tagName == "INPUT"){
                //check for intellisense
                intellisense.hide();
                Editor.getIntellisenseData().then(({curWord, cursorPos}) => {
                    if(curWord && cursorPos){
                        intellisense.check(curWord, cursorPos, el);
                    }
                })
            }
        })
    })  
})


//waits for selected element to load
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

