import {GlobalSetting, BELTS} from "../classes-shared/Settings";

let settings = {};

window.addEventListener("load", async () => {
    //get settings from storage
    const settingsKeys = Object.keys(GlobalSetting);
    GlobalSetting.Get(settingsKeys).then(settingsObj=> {
        //set settings to default if not set
        settings = settingsObj;
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
                GlobalSetting.PASSWORD.Set(password).then(()=>{
                    //show options page
                    initOptions();
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


function initOptions(){
    //set inital setting values

    //intellisense
    const intellisenseCase = document.getElementById("options-intellisense-caseSensitive");
    intellisenseCase.checked = settings[GlobalSetting.CASE_SENSITIVE.key];

    //createBeltLinkElement(beltKey, containerId, settingsKey)
    for(let [index, beltKey] of BELTS.entries()){
        if(index < 4){
            createBeltIntellisenseElements(beltKey);
        }
        //create link elements
        createBeltLinkElement(beltKey, "options-belt-helper-links", GlobalSetting.PROVE_YOURSELF_SOS.key);
        createBeltLinkElement(beltKey, "options-belt-end-links", GlobalSetting.END_OF_BELT_QUIZ.key);
    }

    initAutoSave();

    //add event listeners
    document.getElementById("options-password-button").addEventListener("click",(e)=>{
        //check password isnt blank
        const passwordEl = document.getElementById("options-password-input");
        if(passwordEl.value){
            //save password
            GlobalSetting.PASSWORD.Set(passwordEl.value).then(()=>{
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
        // TODO
        //reset values
        GlobalSetting.PASSWORD.Set(GlobalSetting.PASSWORD.defaultValue).then(()=>{
            //refresh page
            location.reload();
        })
    })

    intellisenseCase.addEventListener("change",(e)=>{
        //set intellisense case sensitive
        settings[GlobalSetting.CASE_SENSITIVE.key] = intellisenseCase.checked;
        GlobalSetting.CASE_SENSITIVE.Set(intellisenseCase.checked)
    })

    //show options
    show(document.getElementById("options"))
}

function initAutoSave(){
    //checkbox
    document.getElementById("options-scene-autoSaveEnabled").checked = settings[GlobalSetting.AUTO_SAVE_ENABLED.key];
    document.getElementById("options-scene-autoSaveEnabled").addEventListener("change",(e)=>{
        settings[GlobalSetting.AUTO_SAVE_ENABLED.key] = e.target.checked;
        GlobalSetting.AUTO_SAVE_ENABLED.Set(e.target.checked);
    })
    //dropdown
    document.getElementById("options-autosave-dropdown-button").innerText = settings[GlobalSetting.AUTO_SAVE_INTERVAL.key] + " minutes";
    let listItems = document.getElementsByClassName("options-autosave-dropdown-item");
    for (let listItem of listItems){
        listItem.addEventListener("click",(e)=>{
            let value = listItem.getAttribute("value");
            settings[GlobalSetting.AUTO_SAVE_INTERVAL.key] = value;
            GlobalSetting.AUTO_SAVE_INTERVAL.Set(value);
            document.getElementById("options-autosave-dropdown-button").innerText = value + " minutes";
        })
    }
}

function createBeltIntellisenseElements(beltKey){
    const beltsEnabledContainer = document.getElementById("options-intellisense-belts-enabled");
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
        GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.Set(settings[GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.key]);
    })
}

function createBeltLinkElement(beltKey, containerId, settingsKey){
    const container = document.getElementById(containerId);
    //create elements
    const formContainer = document.createElement("div");
    formContainer.className = "form-text col-sm-12 col-md-3";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-text-input";
    input.id = containerId+beltKey;
    input.value = settings[settingsKey][beltKey];
    const label = document.createElement("label");
    label.className = "form-text-label";
    label.innerText = beltKey;
    label.setAttribute("for",input.id);

    //add to dom
    formContainer.appendChild(input);
    formContainer.appendChild(label);

    input.addEventListener("change", (e)=>{
        settings[settingsKey][beltKey] = e.target.value;
        GlobalSetting.Set(settingsKey, settings[settingsKey]);
    })

    container.appendChild(formContainer);
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