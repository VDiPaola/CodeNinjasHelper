//import background scripts
import Intellisense from "./background-scripts/intellisense.js";
import Dom from "./background-scripts/dom.js";


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


async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "intellisense") {
        //intellisense.js
          getCurrentTab().then(tab => {
            if(tab){
                const func = Intellisense.onMessage(data);
                execScript(tab.id, func, [data]).then(res => sendResponse(res))
            }
        })
      
    }else if (data.type === "dom") {
        //get method
        getCurrentTab().then(tab => {
            if(tab){
                const func = Dom.onMessage(data);
                execScript(tab.id, func, [data]);
            }
        })
      }
    return true;
});