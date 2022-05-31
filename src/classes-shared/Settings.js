
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
                    resolve(value[this.key]);
                })
            }else{
                GlobalSetting.Get(this.key).then(value=>{
                    resolve(value[this.key]);
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
    static AUTO_SAVE_INCREMENT = new Setting('AUTO_SAVE_INCREMENT', 5);
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

    static Themes = ['ambiance','chaos','chrome','clouds','clouds_midnight','cobalt','crimson_editor','dawn','dracula','dreamweaver','eclipse','github','gob','gruvbox','idle_fingers','iplastic','katzenmilch','kr_theme','kuroir','merbivore','merbivore_soft','mono_industrial','monokai','nord_dark','one_dark','pastel_on_dark','solarized_dark','solarized_light','sqlserver','terminal','textmate','tomorrow','tomorrow_night','tomorrow_night_blue','tomorrow_night_bright','tomorrow_night_eighties','twilight','vibrant_ink','xcode'];


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