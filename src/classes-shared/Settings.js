
class Setting{
    constructor(key, defaultValue){
        this.key = key;
        this.defaultValue = defaultValue;
    }
}

const defaultLinkValues = {
    white: "",
    yellow: "",
    orange: "",
    green: "",
    blue: "",
    purple: "",
    brown: "",
    red: "",
    black: ""
}
export class GlobalSetting {
    static CASE_SENSITIVE = new Setting('CASE_SENSITIVE', false);
    static PASSWORD = new Setting('PASSWORD', null);
    static AUTO_SAVE_INCREMENT = new Setting('AUTO_SAVE_INCREMENT', 5);
    static PROVE_YOURSELF_SOS = new Setting('PROVE_YOURSELF_SOS', defaultLinkValues);
    static END_OF_BELT_QUIZ = new Setting('END_OF_BELT_QUIZ', defaultLinkValues);


    static Get(keys){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(keys, (result) => {
                resolve(result);
            });
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({[key]: value}, (result) => {
                resolve(result);
            });
        });
    }
    
}

export class LocalSetting {
    static WORD_WRAP = new Setting('WORD_WRAP', false);


    static Get(keys){
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(keys, (result) => {
                resolve(result);
            });
        });
    }

    static Set(key, value){
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({[key]: value}, (result) => {
                resolve(result);
            });
        });
    }
}