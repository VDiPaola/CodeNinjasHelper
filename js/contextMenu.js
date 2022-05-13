//right click menu, not being currently used

const contexts = ["editable"];

const parentId = chrome.contextMenus.create({
    id: "CodeNinjasHelper",
    title: "Code Helper",
    contexts
});

chrome.contextMenus.create({
  id: "CodeNinjasHelper1",
  title: "If Statement",
  parentId,
  contexts
});

chrome.contextMenus.onClicked.addListener((data)=>{
    console.log(data)
    if(data.menuItemId == contextMenuItem.id){

    }
})

