// background.js
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function appendText(value, position=null){
  const ace = window.ace
  const editor = ace.edit("ws");

  if(position){
    editor.setValue(value, position);
  }else{
    editor.setValue(value);
  }
  
}

function onChange(replace){
  const ace = window.ace
  const editor = ace.edit("ws");
  const Range = require('ace/range').Range;
  editor.session.on('change', function(delta) {
    const range = editor.find("if",{
      backwards: true,
      wrap: false,
      caseSensitive: false,
      wholeWord: false,
      regExp: false
    });
    if (range) {
      editor.insert("Something cool");
    }
    // // editor.findNext();
    // // editor.findPrevious();
    // editor.replaceAll("if () {}");
    
    return;
    // delta.start, delta.end, delta.lines, delta.action
    //make way for optional printing of stuff
    //https://ace.c9.io/#nav=api&api=search
    editor.session.replace(new Range(0, 0, 1, 1), "abc");
  });
}



function setTheme(value){
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.setTheme(value);
}

async function execScript(tabId, func, args) {
  chrome.scripting.executeScript({
    func,
    args,
    target: {
      tabId: tabId ??
        (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
    },
    world: 'MAIN',
  });
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.type === "ace") {
    getCurrentTab().then(tab => {
      if(tab){
        switch(data.message){
          case "appendText":
            execScript(tab.id, appendText, [data.value])
            break;
          case "setTheme":
            execScript(tab.id, setTheme, [data.value])
            break;
          case "onChange":
            execScript(tab.id, onChange)
            break;

        }
        
        
      }
    })
    
  }
  return true;
});



// async function getPageVar(name, tabId) {
//   const [{result}] = await chrome.scripting.executeScript({
//     func: name => window[name],
//     args: [],
//     target: {
//       tabId: tabId ??
//         (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
//     },
//     world: 'MAIN',
//   });
//   return result;
// }