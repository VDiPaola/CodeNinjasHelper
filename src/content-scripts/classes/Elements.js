export const STAR_ELEMENT = `
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

const GENERAL_OBJECT = `
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
            <input type="number" step="0.01" class="form-control" data-bind="value : selectedObject().scaleX" />
        </div>
        <div class="form-group" data-bind="visible : selectedObject().scaleY">
            <label class="">Scale Y</label>
            <input type="number" step="0.01" class="form-control" data-bind="value : selectedObject().scaleY" />
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