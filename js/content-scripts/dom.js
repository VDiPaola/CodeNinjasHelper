
const li = `
<div class="row header-row clearfix">
<div class="col-md-7 text-nowrap padding-top-1 bg-dark-orange">
    <h3 class="text-black">End Of Belt Quiz</h3>
</div>
    <div class="col-md-1 bg-green text-center header-link" style="margin-bottom: 20px !important;"><a href=""><i class="fa fa-play"></i> </a></div>
</div>
`


window.addEventListener("load", async () => {
    if(window.location.pathname.includes("/students/cn-cambridge-cam-uk/")){
        waitForElement(".popup .row div:first-child").then(el=>{
            const newButton = document.createElement("button");
            newButton.textContent = "Prove Yourself S.O.S";
            newButton.classList = "btn btn-success btn-block"
            newButton.addEventListener("click", ()=>{
                window.open("");
            })
            el.appendChild(newButton);
        })
    }else if(window.location.pathname.includes("/Treks/Details/")){
        waitForElement("#scenes").then(el=>{
            const newLi = document.createElement("li");
            newLi.innerHTML = li
            el.appendChild(newLi);
        })
    }else if(window.location.pathname.includes("/Scenes/Play/")){
        waitForElement(".ace_text-input").then(() => {
            //page is loaded
            chrome.runtime.sendMessage({type:"dom"});
        })
    }
})



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

