function save(){
    //if not complete and game stopped then save
    if(!viewModel.isComplete?.() && viewModel.scene?.()?.state?.() === 'STOP'){
        viewModel.save()
    }
}

function subscribeChanges(){
  if(viewModel.scene){
    //subscribe to edit scene after it gets refreshed
    viewModel.scene.subscribe((scene=> {
      const startCode = scene.startCode; 
      scene.startCode = ()=>{
        //append to startCode so it clears console
        viewModel.clearConsole();
        startCode();
      }
    }))
  }
}

// execScript(tab.id, replaceScript, ["props_STAR", test]);
export default class Scene{
  static onMessage(message){
    switch(message){
      case "save":
        return save;
      case "subscribeChanges":
        return subscribeChanges;
    }
  }
}

