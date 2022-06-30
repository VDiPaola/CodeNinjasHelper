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
      //START CODE
      const startCode = scene.startCode; 
      scene.startCode = ()=>{
        //append to startCode so it clears console
        viewModel.clearConsole();
        startCode();
      }
      
      //CLONE
      var updateChildIDs = function (i, e) {
        e.name = scene.findUniqueName(e.name);
        e.slug = CodeTreks.Utilities.getSlug();
        e.id = Math.random();

        $.each(e.objects, updateChildIDs);
    };
      scene.customClone = (obj, init, resetIDs, parent)=>{
        init = (init == null) ? true : init;
        parent = parent == null ? obj.parent : parent;
        resetIDs = resetIDs == null ? true : resetIDs;

        var js = CodeTreks.Utilities.toJS(obj);

        if (resetIDs) {
            js.name = obj.scene.findUniqueName(js.name);
            js.id = Math.random();
            js.slug = CodeTreks.Utilities.getSlug();
            $.each(js.objects, updateChildIDs);
        }

        var obj2 = CodeTreks.Utilities.createGameObject(js, obj.scene, parent);

        if (init) { obj2.onInitialize(); }

        obj2.createdAtGameTime(obj.scene.mode() == window.Scene.MODE_PLAY);
        obj2.createdByPlayer(false);

        if (parent?.data?.type && (parent.type() == "GO_SCENE" || parent.type() == "GO_GROUP")){
          parent.addChild(obj2);
        }else{
          obj.parent.addChild(obj2);
        }

        return obj2;
      }

      //CHANGE PARENT
      scene.changeParent = (child, parent) => {
        //make sure nodes exist
        if(!child || !parent || !child.parent) return scene.id;
        //get original parent
        let ogParent = child.parent;
        //make sure new parent is valid type
        if (ogParent != parent && (parent.type() == "GO_SCENE" || parent.type() == "GO_GROUP")){
          //consider doing the child check here aswell but doesnt seem necesary 
          parent.addChild(child);
          ogParent.objects.remove(child);
          return parent.id;
        }
        return ogParent.id;
      }

      //GET PARENTS FOR <SELECT>
      scene.getParents = ko.computed(() => {
        obj = scene.selectedObject()
        let parents = []
        const allChildren = obj.objects().length > 0 ? scene.allChildren([obj]): [];

        let allObjects = [scene]
        allObjects.push(...scene.allChildren(scene.objects()).filter(o => o?.type() == "GO_GROUP"))
        for (let object of allObjects) {
            if(object != obj && !allChildren.includes(object)){
              const name = object.name() //|| `new ${object.type()}`
              option = `<option value='${object.id}'>${name}</option>`
              if (!parents.includes(option)) parents.push(option) 
            }
        }

        return parents
      })
      scene.selectedTest = ko.computed(()=>{
        let obj = scene.selectedObject()
        return obj.parent != null ? obj.parent.id:0
      })

      //GET CURRENT OBJECTS PARENT ID
      scene.selectedParentId = ko.computed(()=>{
        return scene.selectedObject()?.parent?.id || scene.id
      })

      //GET OBJECT BY ID
      scene.getObjectById = (id)=>{
        let allObjects = [scene]
        allObjects.push(...scene.allChildren(scene.objects()))
        filteredObj = Object.values(allObjects).filter(obj => obj.id == id)
        if (filteredObj.length == 1){
          return filteredObj[0]
        }else{
          return null
        }
      }


      //MULTI SELECT WIP
      // let selectedObjects = []
      // let selectObject = scene.selectObject
      // scene.selectObject = (obj)=>{
      //   if (window.CodeTreks.Input.keyboard.isKeyDown(17)){
      //     selectedObjects.push(obj)
      //     alert("lol")
      //   }else{
      //     selectedObjects = []
      //   }
      //   selectObject(obj)
      // }


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

