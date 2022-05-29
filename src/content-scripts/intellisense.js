import { Editor } from "./classes/Editor";
import { Intellisense } from "./classes/Intellisense";
import {waitForElement} from "./classes/Helpers";
import {GlobalSetting, BELTS} from "../classes-shared/Settings";

window.addEventListener("load", async () => {
    //wait for editor to load

    //check intellisense should be enabled
    GlobalSetting.INTELLISENSE_ENABLED_PER_BELT.Get().then((value) => {
        const metaTags = document.querySelectorAll("[property]");
        let intellisenseEnabled = false;
        //loop through meta tags to get name of current belt
        for(let meta of metaTags){
            const possibleBelt = meta.getAttribute("content").split(" ")[0].toLowerCase();
            //check if belt is on/off
            if(BELTS.includes(possibleBelt) && value[possibleBelt]){
                intellisenseEnabled = true;
                break;   
            }
        }
        console.log(intellisenseEnabled)
        if(intellisenseEnabled){
            //start intellisense
            startIntellisense();
        }
    })
    
})


function startIntellisense(){
    waitForElement(".ace_text-input").then((textInputElement) => {
        //setup objects
        const intellisense = new Intellisense();
        Editor.init();
        Editor.setTheme("ace/theme/twilight");

        textInputElement.addEventListener("keydown", function(e){
            const el = e.target;
            if(el.tagName == "TEXTAREA" || el.tagName == "INPUT"){
                //check for enter press
                
                if( (e.code == "Enter" || e.code == "ArrowUp" || e.code == "ArrowDown") && intellisense.isVisible() && intellisense.container.children.length > 0){
                    e.preventDefault();
                    e.stopPropagation();
                    //insert intellisense if available
                    switch(e.code){
                        case "ArrowUp":
                            intellisense.onUpArrow();
                            break;
                        case "ArrowDown":
                            intellisense.onDownArrow();
                            break;
                        case "Enter":
                            intellisense.submit(intellisense.container.children[intellisense.currentlySelectedIndex]);
                            break;
                    }
                }else{
                    //check for intellisense
                    Editor.getIntellisenseData().then(({curWord, cursorPos}) => {
                        console.log(curWord)
                        if(curWord && cursorPos){
                            intellisense.check(curWord, cursorPos, el);
                        }else{
                            intellisense.hide();
                        }
                    })
                }
                
            }else{
                intellisense.hide();
            }
        })
    })
}