const Dictionary = {
    "Platform Hit": `
/** 
PUT IN AVATAR/PLAYER 'Initialize When Scene Starts'
WORKS WITH NESTED OBJECTS
e.g.
let hitEnemy = $this.hit("enemy")
or
let hitEnemy = $this.hit("enemy", player)
**/

if ($this.scene.state() == "PLAY") {
    let roleTimers = {}
    let roleObjects = {}
    const boundingBox = function(o) {
        // get the location and w/h using the scales
        var ox = o.x();
        var oy = o.y();
        var ow =  o.width() * o.scaleX();
        var oh =  o.height() * o.scaleY();
        if (o.type() == "GO_SHAPE") {
            ox -= ow / 2;
            oy -= oh / 2;
        }
        // determine the coordinates of the bounding box
        var left = Math.min(ox, ox + ow);
        var right = Math.max(ox, ox + ow);
        var top = Math.min(oy, oy + oh);
        var bottom = Math.max(oy, oy + oh);
        
        return { left, right, top, bottom };
    };
    $this.hit = function (role, player=null) {
        // only grab new objects every 200 frames per role
        if (roleTimers[role] <= 0 || !roleTimers.hasOwnProperty(role)) {
            roleObjects[role] = $this.scene.allChildren($this.scene.objects())
                .filter(obj => obj.role() === role);
            roleTimers[role] = 200;
        }
        roleTimers[role]--
        let p = boundingBox(player || $this);
        for (let currentObject of roleObjects[role]) {
            // get object location and w/h using the scales
            let o = boundingBox(currentObject);
            // check to see if the two boxes overlap
            let isOverlapping = 
                (p.right >= o.left) && (p.left <= o.right) && 
                (p.top <= o.bottom) && (p.bottom >= o.top);
            if (isOverlapping) {
                // if something touched, reset the timer to check
                roleTimers[role]  = 200;
                return currentObject;
            }
        }
        return null;
    }; 
}`,

    "Platform Hide": `
//PLATFORM HIDE (works with nested objects)
if($this.scene.state() == "PLAY"){

    let allObjects = $this.scene.allChildren($this.scene.objects())
    
    
    //hide platforms
    const floors = allObjects.filter(o => o.role() === "floor");
    for(let floor of floors){
        floor.visible(false);
    }
    
    //hide walls
    const walls = allObjects.filter(o => o.role() === "wall");
    for(let wall of walls){
        wall.visible(false);
    }
    
    //hide ceiling
    const ceilings = allObjects.filter(o => o.role() === "ceiling");
    for(let ceiling of ceilings){
        ceiling.visible(false);
    }
    
    //hide exits
    const exits = allObjects.filter(o => o.role() === "exit");
    for(let exit of exits){
        exit.visible(false);
    }
}`,

    "Avatar Controls": `platforms.checkCollision($this);\nplatforms.characterMove($this);`,

    "Candy Sort": `
//checks if you are touching the same colour bin or not
//(YOU WILL NEED TO IMPLEMENT THE SCORING PART)
if ($this.isTouching(bins)) {
    var colourIndex = $this.frameIndex();
    if ($this.isTouching($this.scene.findName("bin" + colourIndex))) {
        //same colour
        
    }else{
        //different colour
        
    }
    $this.remove()
}`,

    "Freeze Frame":`
$this.scene._onFramesPerSecondChanged(0.0000000000001);
$this.scene.cleanupTimers();`
}

export default Dictionary;