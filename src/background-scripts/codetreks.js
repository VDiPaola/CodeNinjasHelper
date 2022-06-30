function subscribeKeyDown(){
  if(window?.CodeTreks?.Input?.keyboard?.onkeydown){
    //check for on key down
    window.CodeTreks.Input.keyboard.onkeydown.subscribe(keyCode => {
        if(keyCode == 46){
            //del key
            if(viewModel?.scene()?.removeSelectedObject){
                viewModel?.scene()?.removeSelectedObject()
            }
        }
    })
  }
}

export default class CodeTreks{
  static onMessage(message){
    switch(message){
      case "subscribeKeyDown":
        return subscribeKeyDown;
    }
  }
}

