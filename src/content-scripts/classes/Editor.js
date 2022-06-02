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