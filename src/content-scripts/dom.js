import { waitForElement, waitForElements, elementBuilder } from "./classes/Helpers";
import { GlobalSetting } from "../classes-shared/Settings";

if(window.location.pathname.includes("/students/cn-cambridge-cam-uk/")){
    //home page
    waitForElements(".popup", 9).then(popups => {
        //get belt link values from global storage
        GlobalSetting.Get([GlobalSetting.PROVE_YOURSELF_SOS.key]).then(({beltLinks}) => {
            if (!beltLinks) return;
            const beltKeys = Object.keys(beltLinks);
            for(let [index, popup] of popups.entries()){
                //append button for each link/popup aslong as it exists
                if (beltKeys[index]){
                    const parentEl = popup.querySelector(".row div:first-child");
                    const newButton = elementBuilder("button", {textContent:"Prove Yourself S.O.S",className:"btn btn-success btn-block"}, parentEl);
                    newButton.addEventListener("click", ()=>window.open(beltLinks[beltKeys[index]]));
                }
            }
        })
    })

}else if(window.location.pathname.includes("/Treks/Details/")){
    //scene selection page
    waitForElement(".full-screen h2").then(beltTextEl => {
        //check theres a link for the belt
        const beltName = beltTextEl.textContent.split(" ")[0].toLowerCase();
        GlobalSetting.Get([GlobalSetting.END_OF_BELT_QUIZ.key]).then(({beltLinks}) => {
            if(!beltLinks) return;
            const beltLink = beltLinks[beltName];
            if(beltLink){
                waitForElement("#scenes").then((el)=>{
                    const div = elementBuilder("div", {className: "row header-row clearfix"}, el);
                    const div2 = elementBuilder("div", {className: "col-md-7 text-nowrap padding-top-1 bg-dark-orange"}, div);
                    elementBuilder("h3", {className: "text-black", textContent:"End Of Belt Quiz"}, div2);
                    const div3 = elementBuilder("div", {className: "col-md-1 bg-green text-center header-link", style:{marginBottom:"20px !important"}}, div);
                    const a = elementBuilder("a", {href: beltLink}, div3);
                    elementBuilder("i", {className: "fa fa-play"}, a);
                })
            }
        })
        
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


