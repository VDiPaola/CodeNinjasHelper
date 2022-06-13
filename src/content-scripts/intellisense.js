import { Editor } from "./classes/Editor";
import { Intellisense } from "./classes/Intellisense";
//import {waitForElement} from "./classes/Helpers";
import {GlobalSetting, BELTS} from "../classes-shared/Settings";

let intellisense;

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
        
        if(intellisenseEnabled){
            //start intellisense
            startIntellisense();
        }
    })
    
})


const waitForElement = (selector, callback) => {

    if (document.querySelector(selector)) {
        callback(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutationList, _) => {
        for(const mutation of mutationList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.matches(selector)) {
                        callback(node);
                    }
                }
            }
        }
    });

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Start observing the target node for configured mutations
    observer.observe(document.body, config);

}

const inputEventListener = (e) => {
    const el = e.target;
    if(el.tagName == "TEXTAREA" || el.tagName == "INPUT"){
        //check for enter press
        
        if( (e.code == "Enter" || e.code == "Tab" || e.code == "ArrowUp" || e.code == "ArrowDown") && intellisense.isVisible() && intellisense.container.children.length > 0){
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
                case "Tab":
                case "Enter":
                    intellisense.submit(intellisense.container.children[intellisense.currentlySelectedIndex]);
                    break;
            }
        }else if(e.code == "Digit0" && intellisense.isShiftDown){
            e.preventDefault();
            e.stopPropagation();
            Editor.checkBrackets();
        }else{
            //check for intellisense
            Editor.getIntellisenseData().then(({curWord, cursorPos}) => {
                //filter curword
                curWord = curWord.length > 1 && curWord[0] == "(" ? curWord.substring(1) : curWord;
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
}

const startIntellisense = () => {
    waitForElement(".ace_text-input", (inputElement)=>{
        //setup objects
        if(!intellisense){
            intellisense = new Intellisense();
            Editor.init();
        }
        
        inputElement.removeEventListener("keydown", inputEventListener);
        inputElement.addEventListener("keydown", inputEventListener);

        //click event for closing intellisense
        document.addEventListener("click", (e)=>{
            if(!intellisense.container.contains(e.target)){
                intellisense.hide();
            }
        })
    })
}