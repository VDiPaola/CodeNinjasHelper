
import Dictionary from './dictionary'
import Intellisense from "../intellisense.js";
import {execScript} from '../helpers.js'

chrome.runtime.onInstalled.addListener( () => {
  chrome.contextMenus.create({
    id: 'code',
    title: "Code Snippets", 
    contexts:[ "editable" ],
    documentUrlPatterns: ["*://gdp.code.ninja/*"]
  });

  for (let key of Object.keys(Dictionary)){
    chrome.contextMenus.create({
      parentId: 'code',
      id: key,
      title: key, 
      contexts:[ "editable" ],
      documentUrlPatterns: ["*://gdp.code.ninja/*"]
    });
  }

});

chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
  if (info.parentMenuItemId == "code" && Dictionary[info.menuItemId]) {
        const func = Intellisense.onMessage("rawInsertText");
        execScript(tab.id, func, [{value:Dictionary[info.menuItemId]}])
  }
});
