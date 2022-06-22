//[data.value, data.position, data.resetUndoHistory]
function setValue({value, cursorPosition, resetUndoHistory=false}){
  //sets text at specified position
  const editor = window.ace.edit("ws");

  if(resetUndoHistory){
    editor.setValue(value, cursorPosition);
  }else{
    editor.session.setValue(value, cursorPosition);
  }
  
}

function insertText({value}){
  //inserts text as if user typed it
  const editor = window.ace.edit("ws");

  //get how many tabs at start of current line
  const tabChar = editor.session.getTabString();
  const tabSize = editor.session.getTabSize();
  //get current line and split by tabs
  const unsplitLine = editor.session.getLine(editor.selection.getCursor().row);
  const splitLine = unsplitLine.split(tabChar);
  //count how many tabs there are
  let tabCounter = 0
  for(let word of splitLine){
    if(word === ""){
      tabCounter++
    }else{
      break;
    }
}

  //insert text with correct indentation
  const lines = value.split("\n");
  let cursorCol = 0;
  let cursorRow = 0;
  lines.forEach((line, index) => {
    line = line.replace("[tab]", tabChar);

    if(line.includes("[cursor]")) {
      //get cursor position and remove from string
      cursorCol = line.indexOf("[cursor]");
      if(index === 0) {cursorCol += editor.selection.getCursor().column;}
      //adds 1 assumes it needs to tab out (fix this)
      else{cursorCol += (tabCounter+1) * tabSize;}
      cursorRow = lines.length - 2 - index;
      line = line.replace("[cursor]", "");
    }

    //insert text
    if(index === 0){
      editor.insert(line);
    }else{
      editor.insert("\n");
      editor.insert(line);
    }
  });

  if(cursorRow !== 0 && cursorCol !== 0){
    //set cursor position
    const cursorLine = editor.selection.getCursor().row - cursorRow;
    editor.gotoLine(cursorLine, cursorCol, true);
  }
  
  
  
}

function getAllText(){
  //returns all text in editor
  const editor = window.ace.edit("ws");

  //editor.insert(value);
  return editor.getValue();
}


function replaceInRange({value, startRow, startColumn, endRow, endColumn}){
  //replaces text in range
  const editor = window.ace.edit("ws");

  const range = new Range(startRow, startColumn, endRow, endColumn);
  editor.session.replace(range, value);
}

function getCursor(){
  //returns range that cursor is at
  const editor = window.ace.edit("ws");
  return editor.selection.getCursor();
}

function moveCursorTo({row, column}){
  //moves cursor to specified position
  const editor = window.ace.edit("ws");
  editor.moveCursorTo(row, column);
}

function setFontSize({value}){
  const editor = window.ace.edit("ws");
  editor.setFontSize(value);
}

function getIntellisenseData(){
  //returns current word and cursor position and if its object
  const editor = window.ace.edit("ws");
  const Range = window.ace.require("ace/range").Range;

  const range = editor.selection.getCursor();
  //get current line up to cursor
  const line = editor.session.getTextRange(new Range(range.row, 0, range.row, range.column));
  //get current word without tabs
  //const tab = editor.session.getTabString();
  let curWord = line.slice(line.lastIndexOf(" ") + 1).trim();

  //get word after opening bracket if one exists
  const lastIndexOf = curWord.lastIndexOf("(");
  if(lastIndexOf !== -1 && lastIndexOf !== curWord.length-1){
    curWord = curWord.slice(lastIndexOf+1);
  }

  //if word ends in a period, check if object
  let objectData = {};
  if(curWord[curWord.length-1] === "."){
    //get current word without period
    const curWordNoPeriod = curWord.slice(0, curWord.length-1);
    //see if current word is an object
    let curObject = null;
    if(curWordNoPeriod == "$this"){
      curObject = viewModel.scene().selectedObject();
    }else if(curWordNoPeriod == "$this.scene"){
      curObject = viewModel.scene()
    }

    if(!curObject){
      const objects = viewModel.scene().allChildren(viewModel.scene().objects())
      for(let object of objects){
        if(object.name() === curWordNoPeriod){
          curObject = object;
          break;
        }
      }
    }

    //set object data to send back
    objectData.word = curWordNoPeriod

    objectData.displayType = curObject?.data?.displayType || null;
    objectData.displayType = objectData.displayType === curWordNoPeriod ? null : objectData.displayType;

    objectData.type = curObject?.data?.type || null;
    objectData.type = objectData.type == "GO_TEXT" ? "LABEL" : objectData.type;
    objectData.type = curObject?.data?.type == objectData.displayType ? null : objectData.type;
    objectData.type = objectData.type === curWordNoPeriod ? null : objectData.type;
  }

  return {curWord, objectData};
  
}

function getCurrentLine(){
  //returns current line up to the cursor position
  const editor = window.ace.edit("ws");
  const Range = window.ace.require("ace/range").Range;
  
  const range = editor.selection.getCursor();
  return editor.session.getTextRange(new Range(range.row, 0, range.row, range.column));
}

function getCurrentWord(){
  //returns current word before cursor
  const editor = window.ace.edit("ws");
  const Range = window.ace.require("ace/range").Range;
  
  const range = editor.selection.getCursor();
  //get current line up to cursor
  const line = editor.session.getTextRange(new Range(range.row, 0, range.row, range.column));
  //get current word without tabs
  return line.slice(line.lastIndexOf(" ") + 1).trim();
}

//editor.setValue("text2", -1); // set value and move cursor to the start of the text
//editor.getValue(); // or session.getValue

function setTheme({value}){
  const editor = window.ace.edit("ws");
  editor.setTheme(value);
}

function toggleUseWrapMode({value}){
  const editor = window.ace.edit("ws");
  editor.session.setUseWrapMode(!editor.session.getUseWrapMode());
}

function getUseWrapMode({value}){
  const editor = window.ace.edit("ws");
  editor.session.getUseWrapMode();
}


function setTabSize({value}){
  const editor = window.ace.edit("ws");
  editor.session.setTabSize(value);
}

function initFunc(){
  const editor = window.ace.edit("ws");
  //get keybindings to override
  const keyBindings = editor.commands.commandKeyBinding;
  const keyBindingKeys = ["up", "down", "tab"];

  //set default object for options
  window.codeNinjasHelper = {commandBindingsOn: true};

  //override exec function of command keybindings
  for (let key of keyBindingKeys){
    const exec = keyBindings[key].exec;
    keyBindings[key].exec = (editor, args) => {
      if(window.codeNinjasHelper.commandBindingsOn){
        exec(editor, args);
      }
    }
  }
}

function setCommandBindingsOn({value}){
  window.codeNinjasHelper.commandBindingsOn = value;
}

function checkBrackets(){
  //if even number of brackets then move cursor 1 to the right
  const editor = window.ace.edit("ws");
  //get current line
  const line = editor.session.getLine(editor.selection.getCursor().row);
  //get number of brackets
  const openBrackets = line.match(/\(/g);
  const closedBrackets = line.match(/\)/g);

  if(openBrackets?.length === closedBrackets?.length){
    //move cursor by 1
    editor.selection.moveCursorBy(0, 1);
  }else{
    //insert closed bracket
    editor.insert(")");
  }
}


export default class Intellisense{
  static onMessage(message){
    switch(message){
      case "setValue":
        return setValue;
      case "insertText":
        return insertText;
      case "setTheme":
        return setTheme;
      case "getCursor":
        return getCursor;
      case "setFontSize":
        return setFontSize;
      case "setTabSize":
        return setTabSize;
      case "replaceInRange":
        return replaceInRange;
      case "getAllText":
        return getAllText;
      case "moveCursorTo":
        return moveCursorTo;
      case "getIntellisenseData":
        return getIntellisenseData;
      case "getCurrentLine":
        return getCurrentLine;
      case "getCurrentWord":
        return getCurrentWord;
      case "init":
        return initFunc;
      case "setCommandBindingsOn":
        return setCommandBindingsOn;
      case "toggleUseWrapMode":
        return toggleUseWrapMode;
      case "getUseWrapMode":
        return getUseWrapMode;
      case "checkBrackets":
        return checkBrackets;
    }
    
  }
}
