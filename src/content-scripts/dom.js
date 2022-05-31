import { waitForElement, waitForElements, elementBuilder } from "./classes/Helpers";
import { GlobalSetting, BELTS } from "../classes-shared/Settings";
import { STAR_ELEMENT } from "./classes/Elements";

if(window.location.pathname.includes("/students/cn-cambridge-cam-uk/")){
    //home page
    waitForElements(".popup", 9).then(popups => {
        //get belt link values from global storage
        GlobalSetting.PROVE_YOURSELF_SOS.Get().then((beltLinks) => {
            if (!beltLinks) return;
            for(let [index, popup] of popups.entries()){
                //append button for each link/popup aslong as it exists
                if (BELTS[index] && beltLinks[BELTS[index]].length > 0){
                    const parentEl = popup.querySelector(".row div:first-child");
                    const newButton = elementBuilder("button", {textContent:"Prove Yourself S.O.S",className:"btn btn-success btn-block"}, parentEl);
                    newButton.addEventListener("click", ()=>window.open(beltLinks[BELTS[index]]));
                }
            }
        })
    })

}else if(window.location.pathname.includes("/Treks/Details/")){
    //scene selection page
    waitForElement(".full-screen h2").then(beltTextEl => {
        //check theres a link for the belt
        const beltName = beltTextEl.textContent.split(" ")[0].toLowerCase();
        GlobalSetting.END_OF_BELT_QUIZ.Get().then((beltLinks) => {
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
    waitForElement(".ace_text-input").then(inputEl => {
        //go through array of ids and scripts to replace
        const starEl = document.querySelector("#props_STAR");
        if(starEl){
            chrome.runtime.sendMessage({type:"dom", id:"props_STAR", script: STAR_ELEMENT, message:"replaceScript"});
        }
    })
}
