const Dictionary = {
    "if": "if () {\n\t\n}",
	"else": "else {\n\t\n}",
	"function": "function name() {\n\t\n}",
}

class Editor {
    setTheme(theme) {
        this.sendMessage({message: "setTheme", value: theme});
    }

    setValue(text, position, resetUndoHistory=false){
        this.sendMessage({message: "setValue", value: text, position, resetUndoHistory});
    }

    insertText(text){
        this.sendMessage({message: "insertText", value: text});
    }

    setFontSize(fontSize){
        this.sendMessage({message: "setFontSize", value: fontSize});
    }

    setTabSize(tabSize){
        this.sendMessage({message: "setTabSize", value: tabSize});
    }

    replaceInRange(value, startRow, startColumn, endRow, endColumn){
        this.sendMessage({message: "replaceInRange", value, startRow, startColumn, endRow, endColumn});
    }

    moveCursorTo(row, column){
        this.sendMessage({message: "moveCursorTo", value: row, column});
    }

    intellisenseCheck(){
        this.sendMessage({message: "intellisenseCheck", value: Dictionary});
    }

    async getCurrentLine(){
        return await this.sendMessage({message: "getCurrentLine"});
    }

    async getCursor(){
        return await this.sendMessage({message: "getCursor"});
    }

    async sendMessage(data){
        data = {type:"ace", ...data};
        return await chrome.runtime.sendMessage(data)
    }
}


window.onload = () => {
    waitForElement(".ace_text-input").then(() => {
        const editor = new Editor();
        editor.setTheme("ace/theme/twilight");

        window.addEventListener("keydown", function(e){
            const el = e.target;
            if(el.tagName == "TEXTAREA" || el.tagName == "INPUT"){
                editor.intellisenseCheck();
            }
        })
    })   
}




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

