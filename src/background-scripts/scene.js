function save(){
    //if not complete and game stopped then save
    if(!viewModel.isComplete?.() && viewModel.scene?.()?.state?.() === 'STOP'){
        viewModel.save()
    }
}

// execScript(tab.id, replaceScript, ["props_STAR", test]);
export default class Scene{
  static onMessage(message){
    switch(message){
      case "save":
        return save;
    }
  }
}

