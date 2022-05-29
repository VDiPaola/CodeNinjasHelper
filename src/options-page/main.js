import {GlobalSetting, BELTS} from "../classes-shared/Settings";

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
                    initOptions(settings);
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
                    initOptions(settings);
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


function initOptions(settings){
    //set setting values
    const intellisenseCase = document.getElementById("options-intellisense-caseSensitive");
    intellisenseCase.checked = settings[GlobalSetting.CASE_SENSITIVE.key];

    const beltsEnabledContainer = document.getElementById("options-intellisense-belts-enabled");
    for(let beltKey of BELTS){
        //create elements
        const formContainer = document.createElement("div");
        formContainer.className = "form-check col";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = "options-intellisense-belts-enabled-"+beltKey;
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.innerText = beltKey;
        label.setAttribute("for",input.id);
        input.checked = settings[GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.key][beltKey];

        //add to dom
        formContainer.appendChild(input);
        formContainer.appendChild(label);

        beltsEnabledContainer.appendChild(formContainer);

        //event listener
        input.addEventListener("change",(e)=>{
            settings[GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.key][beltKey] = e.target.checked;
            GlobalSetting.Set(GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.key, settings[GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.key]);
        })
    }

    //add event listeners
    document.getElementById("options-password-button").addEventListener("click",(e)=>{
        //check password isnt blank
        const passwordEl = document.getElementById("options-password-input");
        if(passwordEl.value){
            //save password
            GlobalSetting.Set(GlobalSetting.PASSWORD.key, passwordEl.value).then(()=>{
                //show saved message
                passwordEl.value = ""
                alert("Password saved!")
            })
        }else{
            //show error message
            alert("Password cannot be blank!")
        }
    })

    document.getElementById("options-reset-button").addEventListener("click",(e)=>{
        //reset values
        GlobalSetting.Set(GlobalSetting.PASSWORD.key, passwordEl.value).then(()=>{
            //refresh page
        })
    })

    intellisenseCase.addEventListener("change",(e)=>{
        //set intellisense case sensitive
        GlobalSetting.Set(GlobalSetting.CASE_SENSITIVE.key, intellisenseCase.checked)
    })

    //show options
    show(document.getElementById("options"))
}

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