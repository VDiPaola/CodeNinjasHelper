import {GlobalSetting} from '../classes-shared/Settings';

class Scene{
    constructor(){
        this.#save();
    }

    #save(){
        //check if enabled and get interval
        GlobalSetting.Get([GlobalSetting.AUTO_SAVE_INTERVAL.key, GlobalSetting.AUTO_SAVE_ENABLED.key]).then(value=>{
            this.autoSaveInterval = value[GlobalSetting.AUTO_SAVE_INTERVAL.key] ?? GlobalSetting.AUTO_SAVE_INTERVAL.defaultValue;
            this.autoSaveEnabled = value[GlobalSetting.AUTO_SAVE_ENABLED.key] ?? GlobalSetting.AUTO_SAVE_ENABLED.defaultValue;
            if(this.autoSaveEnabled){
                chrome.runtime.sendMessage({type:"scene", message:"save"});
            }
            
        })
        .finally(()=>{
            //run again
            setTimeout(()=>{this.#save()}, 60000 * this.autoSaveInterval);
        })
    }
}

if(window.location.pathname.includes("/Scenes/Play/")){
    const scene = new Scene();
}