const props_STAR = `
<div class="panel panel-default margin-bottom-0 margin-top-0">
<div class="panel-heading"><span class="panel-heading-title">Star</span></div>
<div class="panel-body">
    <div class="form-group">
        <label>Number of Points</label>
        <input type="number" class="form-control"  min="2" max="999" value="5" onchange="((v)=>{
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
            <span type="number" data-bind="text : selectedObject().parent == null ? 'none' : selectedObject().parent.name" />
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
            <input type="number" step="0.01" value="1" class="form-control" oninput="((v)=>{
                if(v == 0){return;}
                v = v == 0 ? 0.01 : v;
                viewModel.scene().selectedObject().scaleX(v);
                this.value = v;
            })(this.value)"  />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().scaleY">
            <label class="">Scale Y</label>
            <input type="number" step="0.01" value="1" class="form-control" onchange="((v)=>{
                if(v == 0){return;}
                v = v == 0 ? 0.01 : v;
                viewModel.scene().selectedObject().scaleY(v);
                this.value = v;
            })(this.value)"  />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().scaleY">
            <label class="">Opacity: <span data-bind="text:selectedObject().opacity"></span></label>
            <input type="range" min="0" max="1" step="0.01" class="form-control" data-bind="value : selectedObject().opacity" />
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
            <div class="custom-form">
            <input type="number" class="form-control" data-bind="value : selectedObject().x" required />
            <button type="button" class="btn btn-primary" >Left</button>
            <button type="button" class="btn btn-primary" >Center</button>
            <button type="button" class="btn btn-primary" >Right</button>
            </div>
        </div>
    </div>
    <div class="form-group">
            <label>Y: <span data-bind="text:selectedObject().y"></span></label>
            <input type="range" min="0" max="viewModel.scene().height()" step="1" class="form-control" oninput="((v)=>{
                viewModel.scene().selectedObject().y(v);
                this.value = v;
            })(this.value)"/>
    </div>
    <div class="form-group">
        <div class="input-group">
            <label class="input-group-addon" title="Controls the up/down position of the object.">Y</label>
            <input type="number" class="form-control" data-bind="value : selectedObject().y" required />
        </div>
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

export const Elements = {
    props_STAR,
    Object_General,
    GO_Position
}