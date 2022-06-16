const Themes = ['monokai','ambiance','chaos','chrome','clouds','clouds_midnight','cobalt','dawn','dreamweaver','eclipse','github','gob','gruvbox','idle_fingers','iplastic','kr_theme','merbivore','mono_industrial','solarized_dark','solarized_light','terminal','tomorrow_night','tomorrow_night_blue','tomorrow_night_bright','twilight','vibrant_ink'];


//gets current tab
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

(async () => {
    //THEME DROPDOWN
    let ul = document.getElementById("themeDropdownList");
    for(let theme of Themes){
        //create list element for each theme
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.textContent = theme;
        a.className = "dropdown-item";
        a.addEventListener("click", () => {
            //if current tab has editor set theme
            getCurrentTab().then(tab => {
                if(tab.url.includes("/Scenes/Play/")){
                    document.getElementById("themeDropdown").innerText = theme;
                    //switch to theme on background script
                    chrome.runtime.sendMessage({type:"intellisense",message:"setTheme", value:"ace/theme/"+theme});
                }
            })
            
            
        });
        li.appendChild(a);
        ul.appendChild(li);
    }

    //WRAP MODE BUTTON
    let wrapMode = document.getElementById("wordWrap-button");
    wrapMode.addEventListener("click", _=>{
        chrome.runtime.sendMessage({type:"intellisense",message:"toggleUseWrapMode"});
    })
})()