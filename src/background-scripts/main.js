//import background scripts
import Intellisense from "./intellisense.js";
import Dom from "./dom.js";
import Scene from "./scene.js";
import CodeTreks from "./codetreks.js";

//executes function in main 'world'
async function execScript(tabId, func, args=[]) {
    const [{result}] = await chrome.scripting.executeScript({
      func,
      args,
      target: {
        tabId: tabId ??
          (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
      },
      world: 'MAIN',
    });
    return result;
}

//gets current tab
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "intellisense") {
        //intellisense.js
          getCurrentTab().then(tab => {
            if(tab && data.message){
                const func = Intellisense.onMessage(data.message);
                if(func){
                    execScript(tab.id, func, [data]).then(res => sendResponse(res))
                }
            }
        })
      
    }else if (data.type === "dom") {
        //get method
        getCurrentTab().then(tab => {
            if(tab && data.message){
                const func = Dom.onMessage(data.message);
                if(func){
                    execScript(tab.id, func, [data]);
                }
                
            }
        })
    }else if (data.type === "scene") {
        //get method
        getCurrentTab().then(tab => {
            if(tab && data.message){
                const func = Scene.onMessage(data.message);
                if(func){
                    execScript(tab.id, func, [data]);
                }
                
            }
        })
    }else if (data.type === "codetreks") {
        //get method
        getCurrentTab().then(tab => {
            if(tab && data.message){
                const func = CodeTreks.onMessage(data.message);
                if(func){
                    execScript(tab.id, func, [data]);
                }
                
            }
        })
    }
    return true;
});