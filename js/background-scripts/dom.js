
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

// const observer = new MutationObserver((mutationList, _) => {
//     for(const mutation of mutationList) {
//         if (mutation.type === 'childList') {
//             for(const node of mutation.addedNodes) {
//                 if(node.id === 'props_STAR') {
//                     console.log("???")
//                     node.remove()
                    
//                 }
//             }
//         }
//     }
// });
// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });


function replaceScript(id, script) {
    document.getElementById(id).remove();
    var s = document.createElement("script");
    s.type = "text/html";
    s.text = script;
    s.id = id;
    document.getElementsByTagName("body")[0].appendChild(s);
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


  async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "dom") {
      getCurrentTab().then(tab => {
        if(tab){
            execScript(tab.id, replaceScript, ["props_STAR", test]);
        }
      })
      
    }
    return true;
  });