const storageGet = (keys) => {
    return new Promise((resolve,_)=>{
        chrome.storage.local.get(keys, (res)=> resolve(res));
    })
}

const storageSet = (key, value) => {
    return new Promise((resolve,_)=>{
        chrome.storage.local.set({[key]:value}, (res)=> resolve(res));
    })
}


(async () => {
    //get on/off value
    storageGet(["isOn"])
        .then(res => {
            console.log(res);
            
        })
    const powerButton = document.getElementById("powerButton")
    powerButton.addEventListener("click", (e) => {
        
    })
})()