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

const storageGetLocal = (keys) => {
    return new Promise((resolve,_)=>{
        chrome.storage.sync.get(keys, (res)=> resolve(res));
    })
}

const storageSetLocal = (key, value) => {
    return new Promise((resolve,_)=>{
        chrome.storage.sync.set({[key]:value}, (res)=> resolve(res));
    })
}

let isOn = true;
(async () => {
    //get on/off value
    storageGet(["isOn"])
        .then(res => {
            console.log(res);
            isOn = res;
        })
    const powerButton = document.getElementById("powerButton")
    powerButton.addEventListener("click", (e) => {
        //toggle
        
    })
})()