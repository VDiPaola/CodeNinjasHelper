function replaceScript({id, script}) {
    document.getElementById(id).remove();
    var s = document.createElement("script");
    s.type = "text/html";
    s.text = script;
    s.id = id;
    document.getElementsByTagName("body")[0].appendChild(s);
}

// execScript(tab.id, replaceScript, ["props_STAR", test]);
export default class Dom{
  static onMessage(message){
    switch(message){
      case "replaceScript":
        return replaceScript;
    }
  }
}