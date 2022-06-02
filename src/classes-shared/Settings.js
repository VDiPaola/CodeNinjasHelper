
class Setting{
    constructor(key, defaultValue, local=false){
        this.key = key;
        this.defaultValue = defaultValue;
        this.local = local;
    }

    Get(){
        return new Promise((resolve, reject)=>{
            if(this.local){
                LocalSetting.Get(this.key).then(value=>{
                    let res = value[this.key] ?? this.defaultValue;
                    resolve(res);
                })
            }else{
                GlobalSetting.Get(this.key).then(value=>{
                    let res = value[this.key] ?? this.defaultValue;
                    resolve(res);
                })
            }
        })
    }

    Set(value){
        return new Promise((resolve, reject)=>{
            if(this.local){
                LocalSetting.Set(this.key, value).then(value=>{
                    resolve(value);
                })
            }else{
                GlobalSetting.Set(this.key, value).then(value=>{
                    resolve(value);
                })
            }
        })
    }
}


export const BELTS = ["white", "yellow", "orange", "green", "blue", "purple", "brown", "red", "black"];
const defaultLinkValues = {}
const defaultEnabledValues = {white:false}
BELTS.forEach(b => {
    defaultLinkValues[b] = ""
    defaultEnabledValues[b] = defaultEnabledValues[b] ?? true;
});

export class GlobalSetting {
    static CASE_SENSITIVE = new Setting('CASE_SENSITIVE', false);
    static PASSWORD = new Setting('PASSWORD', null);
    static AUTO_SAVE_INTERVAL = new Setting('AUTO_SAVE_INTERVAL', 1);
    static AUTO_SAVE_ENABLED = new Setting('AUTO_SAVE_ENABLED', true);
    static PROVE_YOURSELF_SOS = new Setting('PROVE_YOURSELF_SOS', defaultLinkValues);
    static END_OF_BELT_QUIZ = new Setting('END_OF_BELT_QUIZ', defaultLinkValues);
    static INTELLISENSE_ENABLED_PER_BELT = new Setting("INTELLISENSE_ENABLED_PER_BELT", defaultEnabledValues);
    static INTELLISENSE_ENABLED = new Setting("INTELLISENSE_ENABLED", true);
    


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
    static WORD_WRAP = new Setting('WORD_WRAP', false, true);


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