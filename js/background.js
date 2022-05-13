// background.js
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function setValue(value, cursorPosition, resetUndoHistory=false){
  //sets text at specified position
  const ace = window.ace
  const editor = ace.edit("ws");

  if(resetUndoHistory){
    editor.setValue(value, cursorPosition);
  }else{
    editor.session.setValue(value, cursorPosition);
  }
  
}

function insertText(value){
  //insert text as if user typed it
  const ace = window.ace
  const editor = ace.edit("ws");

  editor.insert(value);
}

function getAllText(){
  //returns all text in editor
  const ace = window.ace
  const editor = ace.edit("ws");

  editor.insert(value);
  return editor.getValue();
}


function replaceInRange(value, startRow, startColumn, endRow, endColumn){
  //replaces text in range
  const ace = window.ace
  const editor = ace.edit("ws");
  const Range = require('ace/range').Range;
  const range = new Range(startRow, startColumn, endRow, endColumn);
  editor.session.replace(range, value);
}

function getCursor(){
  //returns range that cursor is at
  const ace = window.ace
  const editor = ace.edit("ws");
  return editor.selection.getCursor();
}

function moveCursorTo(row, column){
  //moves cursor to specified position
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.moveCursorTo(row, column);
}

function setFontSize(fontSize){
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.setFontSize(fontSize);
}

function intellisenseCheck(dictionary){
  const ace = window.ace
  const editor = ace.edit("ws");
  const Range = require('ace/range').Range;
  const range = editor.selection.getCursor();
  //get current line up to cursor
  const line = editor.session.getTextRange(new Range(range.row, 0, range.row, range.column));
  //get current word
  const word = line.slice(line.lastIndexOf(" ") + 1);
  //check if word is in dictionary keys
  if(dictionary.hasOwnProperty(word)){
    //insert value
    editor.insert(dictionary[word]);
  }
}

function getCurrentLine(){
  //returns current line up to the cursor position
  const ace = window.ace
  const editor = ace.edit("ws");
  const Range = require('ace/range').Range;
  const range = editor.selection.getCursor();
  return editor.session.getTextRange(new Range(range.row, 0, range.row, range.column));
}

function getCurrentWord(){
  //returns current word before cursor
  const ace = window.ace
  const editor = ace.edit("ws");
  const Range = require('ace/range').Range;
  const range = editor.selection.getCursor();
  //get current line up to cursor
  const line = editor.session.getTextRange(new Range(range.row, 0, range.row, range.column));
  //get current word
  return line.slice(line.lastIndexOf(" ") + 1);
}

function onChange(){
  const ace = window.ace
  const editor = ace.edit("ws");
  const Range = require('ace/range').Range;
    //chrome.runtime.sendMessage(delta);
    const range = editor.find("if",{
      backwards: true,
      wrap: false,
      caseSensitive: false,
      wholeWord: false,
      regExp: false
    });
    if (range) {
      //editor.insert("Something cool");
    }
    // // editor.findNext();
    // // editor.findPrevious();
    // editor.replaceAll("if () {}");
    
    return;
    editor.session.replace(new Range(0, 0, 1, 1), "abc");
}

//editor.setValue("text2", -1); // set value and move cursor to the start of the text
//editor.getValue(); // or session.getValue

function setTheme(value){
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.setTheme(value);
}

function toggleUseWrapMode(value){
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.session.setUseWrapMode(!editor.session.getUseWrapMode());
}

function getUseWrapMode(value){
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.session.getUseWrapMode();
}

function setTabSize(value){
  const ace = window.ace
  const editor = ace.edit("ws");
  editor.session.setTabSize(value);
}



async function execScript(tabId, func, args=[]) {
  const [{result}] = await chrome.scripting.executeScript({
    func,
    args,
    target: {
      tabId: tabId ??
        (await chrome.tabs.query({active: true, currentWindow: true}))[0].id
    },
    world: 'MAIN',
  });
  return result;
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.type === "ace") {
    getCurrentTab().then(tab => {
      if(tab){
        const send = (res) => sendResponse(res);
        switch(data.message){
          case "setValue":
            execScript(tab.id, setValue, [data.value, data.position, data.resetUndoHistory]).then(send);
            break;
          case "insertText":
            execScript(tab.id, insertText, [data.value]).then(send);
            break;
          case "setTheme":
            execScript(tab.id, setTheme, [data.value]).then(send);
            break;
          case "getCursor":
            execScript(tab.id, getCursor).then(send);
            break;
          case "setFontSize":
            execScript(tab.id, setFontSize, [data.value]).then(send);
            break;
          case "setTabSize":
            execScript(tab.id, setTabSize, [data.value]).then(send);
            break;
          case "replaceInRange":
            execScript(tab.id, replaceInRange, [data.value, data.startRow, data.startColumn, data.endRow, data.endColumn]).then(send);
            break;
          case "getAllText":
            execScript(tab.id, getAllText).then(send);
            break;
          case "moveCursorTo":
            execScript(tab.id, moveCursorTo, [data.row, data.column]).then(send);
            break;
          case "intellisenseCheck":
            execScript(tab.id, intellisenseCheck, [data.value]).then(send);
            break;
          case "getCurrentLine":
            execScript(tab.id, getCurrentLine).then(send);
            break;
          case "getCurrentWord":
            execScript(tab.id, getCurrentWord).then(send);
            break;
          
        }
      }
    })
    
  }
  return true;
});



