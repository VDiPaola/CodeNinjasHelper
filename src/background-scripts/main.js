//import background scripts
import Intellisense from "./intellisense.js";
import Dom from "./dom.js";
import Scene from "./scene.js";
import CodeTreks from "./codetreks.js";

import "./contextMenu/context.js"

import {getCurrentTab, execScript} from './helpers.js'


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