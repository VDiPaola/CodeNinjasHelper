
const elementBuilder = (tagName, elAttributes, parentEl)=>{
    //creates element and sets any attributes passed
    const el = document.createElement(tagName);
    for(let attrKey in elAttributes){
        el[attrKey] = elAttributes[attrKey];
    }
    //append to parent if exist
    if(parentEl) parentEl.appendChild(el);
    return el;
}

// const storageGetLocal = (keys) => {
//     return new Promise((resolve,_)=>{
//         chrome.storage.local.get(keys, (res)=> resolve(res));
//     })
// }

const storageGet = (keys) => {
    return new Promise((resolve,_)=>{
        chrome.storage.sync.get(keys, (res)=> resolve(res));
    })
}



if(window.location.pathname.includes("/students/cn-cambridge-cam-uk/")){
    //home page
    waitForElements(".popup", 9).then(popups => {
        //get belt link values from global storage
        for(let popup of popups){
            const beltId = popup.parentNode.id
            //append button for each link/popup
            const parentEl = popup.querySelector(".row div:first-child");
            const newButton = elementBuilder("button", {textContent:"Prove Yourself S.O.S",className:"btn btn-success btn-block"}, parentEl);
            newButton.addEventListener("click", ()=>window.open(""));
        }
    })

}else if(window.location.pathname.includes("/Treks/Details/")){
    //scene selection page
    waitForElement("#scenes").then((el)=>{
        const div = elementBuilder("div", {className: "row header-row clearfix"}, el);
        const div2 = elementBuilder("div", {className: "col-md-7 text-nowrap padding-top-1 bg-dark-orange"}, div);
        elementBuilder("h3", {className: "text-black", textContent:"End Of Belt Quiz"}, div2);
        const div3 = elementBuilder("div", {className: "col-md-1 bg-green text-center header-link", style:{marginBottom:"20px !important"}}, div);
        const a = elementBuilder("a", {href: ""}, div3);
        elementBuilder("i", {className: "fa fa-play"}, a);
    })
}else if(window.location.pathname.includes("/Scenes/Play/")){
    //inside scene page
    const observer = new MutationObserver((mutationList, _) => {
        for(const mutation of mutationList) {
            if (mutation.type === 'childList') {
                for(const node of mutation.addedNodes) {
                    node.className = node.className ?? "";
                    if(node.id === 'props_STAR') {
                        node.remove()
                        
                    }else if (node.className.includes('ace_text-input')) {
                        chrome.runtime.sendMessage({type:"dom"});
                    }
                }
            }
        }
    });
    observer.observe(document.body, {childList: true,subtree: true});
}


//waits for selected element to load
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
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

//waits for selected element to load
function waitForElements(selector, amount) {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector).length >= amount) {
            return resolve(document.querySelectorAll(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelectorAll(selector) >= amount) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}