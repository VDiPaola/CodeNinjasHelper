const props_STAR = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading"><span class="panel-heading-title">Star</span></div>
<div class="panel-body">
    <div class="form-group">
        <label>Number of Points</label>
        <input type="number" class="form-control"  min="2" max="999" value="5" oninput="((v)=>{
            if(v == 0){return;}
            v = v > 999 ? 999 : v;
            v = v < 2 ? 2 : v;
            viewModel.scene().selectedObject().numPoints(v);
            this.value = v;
        })(this.value)" />
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

const Object_General = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading">
    <div class="row">
        <div class="col-xs-6"><span class="panel-heading-title">General Info</span> (<span data-bind="text: selectedObject().slug"></span>)</div>
        <div class="col-xs-6 text-right padding-right-6">

        <span class="margin-right-2" href="#" data-bind="visible: (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x fa-bullseye"></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:()=>{let s=selectedObject();s.offsetX(s.width()/2);s.offsetY(s.height()/2)}"><i class="fa fa-2x fa-bullseye"></i></a>

            <span class="margin-right-2" href="#" data-bind="visible: (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x fa-copy"></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:()=>{customClone(selectedObject())}"><i class="fa fa-2x fa-copy"></i></a>

            <span class="margin-right-2" href="#" data-bind="visible: selectedObject().isAsset() && (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x fa-chain-broken" data-bind=""></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: selectedObject().isAsset() && (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:disconnectFromAsset"><i class="fa fa-2x fa-chain-broken" data-bind=""></i></a>

            <span class="margin-right-2" href="#" data-bind="visible: selectedObject().isAsset() && (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x fa-cloud-download" data-bind=""></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: selectedObject().isAsset() && (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:loadAsset"><i class="fa fa-2x fa-cloud-download" data-bind=""></i></a>

            
            <a class="margin-right-2" href="#" data-bind="visible: selectedObject().isAsset != null && scene.mode() == 'EDIT', click:saveAsset"><i class="fa fa-2x fa-cloud-upload" data-bind=""></i></a>

            <span class="margin-right-2" href="#" data-bind="visible: selectedObject().isPlaying != null && (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x" data-bind="css: { 'fa-pause': selectedObject().isPlaying && selectedObject().isPlaying(), 'fa-play': selectedObject().isPlaying && !selectedObject().isPlaying() }"></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: selectedObject().isPlaying != null && (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:selectedObject().toggleIsPlaying"><i class="fa fa-2x" data-bind="css: { 'fa-pause': selectedObject().isPlaying && selectedObject().isPlaying(), 'fa-play': selectedObject().isPlaying && !selectedObject().isPlaying() }"></i></a>

            <span class="margin-right-2" href="#" data-bind="visible: selectedObject().visible != null && (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x" data-bind="css: { 'fa-eye': selectedObject().visible && selectedObject().visible(), 'fa-eye-slash': selectedObject().visible && !selectedObject().visible() }"></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: selectedObject().visible != null && (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:selectedObject().toggleVisible"><i class="fa fa-2x" data-bind="css: { 'fa-eye': selectedObject().visible && selectedObject().visible(), 'fa-eye-slash': selectedObject().visible && !selectedObject().visible() }"></i></a>

            <span class="margin-right-2" href="#" data-bind="visible: (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY)"><i class="fa fa-2x" data-bind="css: { 'fa-lock': !selectedObject().draggable(), 'fa-unlock': selectedObject().draggable() }"></i></span>
            <a class="margin-right-2" href="#" data-bind="visible: (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:selectedObject().toggleDraggable"><i class="fa fa-2x" data-bind="css: { 'fa-lock': !selectedObject().draggable(), 'fa-unlock': selectedObject().draggable() }"></i></a>

            <span href="#" data-bind="visible: (mode() != Scene.MODE_EDIT && state() == Scene.STATE_PLAY), click:removeSelectedObject"><i class="fa fa-2x fa-trash"></i></span>
            <a href="#" data-bind="visible: (mode() == Scene.MODE_EDIT || state() == Scene.STATE_STOP), click:removeSelectedObject"><i class="fa fa-2x fa-trash"></i></a>
        </div>
    </div>
</div>
<div class="panel-body">
    <form>
        <div class="form-group">
            <div class="row">
                <div class="col-xs-6">
                    <div class="input-group">
                        <label class="input-group-addon">Name</label>
                        <input type='text' class="form-control" data-bind="value : selectedObject().name" required />
                    </div>
                    <span data-bind="visible: selectedObject().name.hasError(), text:selectedObject().name.validationMessage()" style="color: red;"></span>
                </div>
                <div class="col-xs-6">
                    <div class="input-group">
                        <label class="input-group-addon">Role</label>
                        <input type="text" list="roles" class="form-control" data-bind="objectNameRules, value : selectedObject().role" required />
                        <datalist id="roles">
                            <option value="player"></option>
                            <option value="wall"></option>
                            <option value="floor"></option>
                            <option value="item"></option>
                            <option value="coin"></option>
                            <option value="projectile"></option>
                            <option value="enemy"></option>
                            <option value="npc"></option>
                            <option value="region"></option>
                        </datalist>
                    </div>
                </div>
            </div>

        </div>
        <div class="form-group" data-bind="visible : selectedObject().description != null">
            <label class="">Description</label>
            <textarea class="form-control" data-bind="value : selectedObject().description" required></textarea>
        </div>
        <div
            class="form-group"
            data-bind="template: { afterRender: initCategories, if: selectedObject().isAsset() }"
        >
            <label for="assetCategories">Categories</label>
            <select
                class="form-control"
                multiple="multiple"
                id="assetCategories"
            ></select>
        </div>
        <div
            class="form-group"
            data-bind="template: { afterRender: initTags, if: selectedObject().isAsset() }"
        >
            <label for="assetTags">Tags</label>
            <select
                class="form-control"
                multiple="multiple"
                id="assetTags"
            ></select>
        </div>
        <div class="form-group" data-bind="visible : selectedObject().parent != null">
            <label class="">Parent</label>
            <select name="parent" id="parentSelect" data-bind="html : scene.getParents, value : scene.selectedParentId" onchange="((v)=>{
                let parent = viewModel.scene().getObjectById(v);
                let val = viewModel.scene().changeParent(viewModel.scene().selectedObject(), parent);
                this.value = val;
            })(this.value)" ></select>
        </div>
        <div class="form-group" data-bind="visible : selectedObject().width != null">
            <label class="">Width</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().width" />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().height != null">
            <label class="">Height</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().height" />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().scaleX">
            <label class="">Scale X</label>
            <input type="number" step="0.01" data-bind="attr: {placeholder: selectedObject().scaleX}" class="form-control" oninput="((v)=>{
                let s = String(v)
                if(v == 0 || s[s.length-1] == '.'){return;}
                v = v == 0 ? 0.01 : v;
                viewModel.scene().selectedObject().scaleX(Number(v));
            })(this.value)"  />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().scaleY">
            <label class="">Scale Y</label>
            <input type="number" step="0.01" data-bind="attr: {placeholder: selectedObject().scaleY}" class="form-control" oninput="((v)=>{
                let s = String(v)
                if(v == 0 || s[s.length-1] == '.'){return;}
                v = v == 0 ? 0.01 : v;
                viewModel.scene().selectedObject().scaleY(Number(v));
            })(this.value)"  />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().scaleY">
            <label class="">Opacity: <span data-bind="text:selectedObject().opacity"></span></label>
            <input type="range" min="0" max="1" step="0.01" class="form-control" data-bind="value : selectedObject().opacity"  oninput="((v)=>{
                viewModel.scene().selectedObject().opacity(v);
            })(this.value)"/>
        </div>
        <div class="form-group" data-bind="visible: mode() == 'EDIT'">
            <label><input type="checkbox" data-bind="checked: selectedObject().playerEditCode" /> Player Can Edit Code</label><br />
            <label><input type="checkbox" data-bind="checked: selectedObject().playerEditProperties" /> Player Can Edit Properties</label><br />
            <label><input type="checkbox" data-bind="checked: selectedObject().playerVisibleInTree" /> Player Can See In Tree</label><br />
            <label><input type="checkbox" data-bind="checked: selectedObject().playerBubbleEvents" /> Player Events Bubble To Parent</label>
        </div>
    </form>
</div>
</div>
`

const GO_Position = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading"><span class="panel-heading-title">Position (<span data-bind="text: selectedObject().x"></span>,<span data-bind="text: selectedObject().y"></span>)</span></div>
<div class="panel-body">
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="Controls the left/right position of the object.">X</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().x" required />
        </div>
    </div>
    <div class="form-group">
        <input type="range" min="0" max="800" step="1" class="form-control"  data-bind="value : selectedObject().x" oninput="((v)=>{
            viewModel.scene().selectedObject().x(v);
        })(this.value)"/>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="Controls the up/down position of the object.">Y</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().y" required />
        </div>
    </div>
    <div class="form-group">
            <input type="range" min="0" max="600" step="1" class="form-control"  data-bind="value : selectedObject().y" oninput="((v)=>{
                viewModel.scene().selectedObject().y(v);
            })(this.value)"/>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This determines which objects are in front of others. Small numbers are closer to the user.">Z</label>
            <input type="number" min="0" class="form-control" data-bind="value : selectedObject().z" required />
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This is the angular direction that the object is facing.">Rotation</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().rotation" required />
        </div>
    </div>
    <div class="form-group">
            <input type="range" min="0" max="360" step="1" class="form-control"  data-bind="value : selectedObject().rotation" oninput="((v)=>{
                viewModel.scene().selectedObject().rotation(v);
            })(this.value)"/>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This is the speed that the object travels in the X direction.">Speed X</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().speedX" required />
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This is the speed that the object travels in the Y direction.">Speed Y</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().speedY" required />
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This is the rotational X offset that is relative the object's X value'.">Offset X</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().offsetX" required />
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This is the rotational Y offset that is relative the object's Y value">Offset Y</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().offsetY" required />
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="This is the logical direction that the object is traveling.">Direction</label>
            <select data-bind="value: selectedObject().direction" class="form-control">
                <option value="0">East</option>
                <option value="45">Northeast</option>
                <option value="90">North</option>
                <option value="135">Northwest</option>
                <option value="180">West</option>
                <option value="225">Southwest</option>
                <option value="270">South</option>
                <option value="315">Southeast</option>
            </select>
        </div>
    </div>
</div>
</div>
`

const objectRow = `
<li onclick="event.preventDefault()" data-bind="css : { active : $data == scene.selectedObject()},click: scene.selectObject, visible: scene.mode() == 'EDIT' || playerVisibleInTree" class="list-group-item padding-left-4 padding-right-0 border-gray border-radius-0  border-bottom-0 border-top-1 border-left-5 border-right-0 clearfix text-scene">
<div class="list-group-item-heading clearfix">
    <div class="pull-left">
        <i data-bind="click: toggleShowChildren ,css: { 'fa-circle-o' : objects().length == 0, 'fa-minus-circle' : objects().length > 0 && showChildren(), 'fa-plus-circle' : objects().length > 0 && !showChildren() }" class="fa"></i> &nbsp;
        <a onclick="event.preventDefault()" href="#" data-bind="css : { active : $data == scene.selectedObject()}" class="object-link" ><span data-bind="text: name"></span> (<span data-bind="text: displayType"></span>)</a>
    </div>

</div>
<div class="list-group-item-text" data-bind="visible: objects().length > 0 && showChildren">
    <ul data-bind="template: { name: 'object-row', foreach: objects }" class="sub-object-list padding-left-0 list-group border-radius-0 border-gray  padding-right-0  border-0"></ul>
</div>
</li>
`

const props_CIRCLE = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading"><span class="panel-heading-title">Circle</span></div>
<div class="panel-body">
    <div class="form-group">
        <label>Radius</label>
        <input type="number" min="1" class="form-control" data-bind="attr: {placeholder: selectedObject().radius}" oninput="((v)=>{
            let s = String(v)
            if(v == 0 || s[s.length-1] == '.'){return;}
            v = v < 1 ? 1 : v;
            viewModel.scene().selectedObject().radius(Number(v));
        })(this.value)" />
    </div>
</div>
</div>
`

const props_SHAPE = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading"><span class="panel-heading-title">General Shape</span></div>
<div class="panel-body">
    <div class="form-group">
        <div><label>Background Color</label></div>
        <input type="color" class="form-control" data-bind="value: selectedObject().fill" oninput="((v)=>{
            viewModel.scene().selectedObject().fill(v);
            this.value = v;
        })(this.value)"/>
    </div>
    <div class="form-group">
        <div><label>Stroke Color</label></div>
        <input type="color" class="form-control" data-bind="value: selectedObject().stroke" oninput="((v)=>{
            viewModel.scene().selectedObject().stroke(v);
            this.value = v;
        })(this.value)"/>
    </div>
    <div class="form-group">
        <div><label>Stroke Width: <span data-bind="text: selectedObject().strokeWidth">0</span></label></div>
        <input type="range" step="1" min="0" max="20" class="form-control" data-bind="value: selectedObject().strokeWidth"  oninput="((v)=>{
            viewModel.scene().selectedObject().strokeWidth(v);
        })(this.value)"/>
    </div>
    
</div>
</div>
`

export const Elements = {
    props_STAR,
    Object_General,
    GO_Position,
    "object-row": objectRow,
    props_CIRCLE,
    props_SHAPE
}