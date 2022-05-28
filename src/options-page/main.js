import {GlobalSetting} from "../classes-shared/Settings";

window.addEventListener("load", async () => {
    //get settings from storage
    const settingsKeys = Object.keys(GlobalSetting);
    GlobalSetting.Get(settingsKeys).then(settings=> {
        //set settings to default if not set
        for (let settingKey of settingsKeys){
            if(!settings.hasOwnProperty(settingKey)){
                GlobalSetting.Set(settingKey, GlobalSetting[settingKey].defaultValue);
                settings[settingKey] = GlobalSetting[settingKey].defaultValue;
            }
        }

        
        if(!settings.PASSWORD){
            //show set password if not set
            document.getElementById("signup-button").addEventListener("click",(e)=>{
                if(settings.PASSWORD){return;}
                const password = document.getElementById("password-signup").value;
                GlobalSetting.Set(GlobalSetting.PASSWORD.key, password).then(()=>{
                    //show options page
                    show(document.getElementById("options"))
                    hide(document.getElementById("sign-up"))
                })
            })
            show(document.getElementById("sign-up"))
        }else{
            //show login page
            document.getElementById("login-button").addEventListener("click",(e)=>{
                const password = document.getElementById("password-login").value;
                if(settings[GlobalSetting.PASSWORD.key] === password){
                    //show options page
                    show(document.getElementById("options"))
                    hide(document.getElementById("login"))
                }else{
                    //wrong password
                    show(document.getElementById("password-alert"))
                }
            })
            document.getElementById("password-alert-close").addEventListener("click",(e)=>{
                hide(document.getElementById("password-alert"))
            })
            show(document.getElementById("login"))
        }
    })
    
})

function show(el){
    el.classList.remove("hide");
    el.classList.add("show");
    el.style.opacity = 1;
}

function hide(el){
    el.classList.add("hide");
    el.classList.remove("show");
    el.style.opacity = 0;
}