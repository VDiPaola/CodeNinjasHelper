class CodeNinjasHelper {
    constructor(){
        this.sendMessage({message: "onChange"});
    }

    setTheme(theme) {
        this.sendMessage({message: "setTheme", value: theme});
    }

    appendText(text){
        this.sendMessage({message: "appendText", value: text});
    }

    sendMessage(data){
        data = {type:"ace", ...data};
        chrome.runtime.sendMessage(data);
    }
}


window.onload = () => {
    waitForElm(".ace_text-input").then(() => {
        const codeNinjasHelper = new CodeNinjasHelper();
        codeNinjasHelper.setTheme("ace/theme/twilight");
        codeNinjasHelper.appendText("Hello World");
    })   
}




//waits for selected element to load
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

