import { Editor } from "./classes/Editor";
import { Intellisense } from "./classes/Intellisense";
import {waitForElement} from "./classes/Helpers";

window.addEventListener("load", async () => {
    //wait for editor to load
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
})