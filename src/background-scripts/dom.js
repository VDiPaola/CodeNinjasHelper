const test = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading"><span class="panel-heading-title">Star</span></div>
<div class="panel-body">
    <div class="form-group">
        <label>Number of Points</label>
        <input type="number" class="form-control"  min="2" max="999" value="5" onchange="((v)=>{
            v = v > 999 ? 999 : v;
            v = v < 2 ? 2 : v;
            let el = document.getElementById('numberOfPointsInput')
            el.value = v;
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                el.dispatchEvent(evt);
            }else el.fireEvent("onchange");
        })(this.value)" />
        <input type="number" id="numberOfPointsInput" style="display:none" data-bind="value: selectedObject().numPoints" />
    </div>
    <div class="form-group">
        <label>Inner Radius</label>
        <input type="number" class="form-control" data-bind="value: selectedObject().innerRadius" />
    </div>
    <div class="form-group">
        <label>Outer Radius</label>
        <input type="number" class="form-control" data-bind="value: selectedObject().outerRadius" />
    </div>
</div>
</div>
`



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