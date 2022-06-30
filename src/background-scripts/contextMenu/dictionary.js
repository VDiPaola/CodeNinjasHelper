const Dictionary = {
    "Platform Functions": `
    /**
     includes 'Platform Hit' functions
     .playerHit(object,role)
     .hit(object,role)
     **/
    
if ($this.scene.state() == "PLAY") {
     //PLAYER FUNCTIONS
    
     $this.allObjects = [];
     
     $this.timeout = 0;
     
     $this.checkCollision = function(entity){
         var isCol = false;
     
         // reset the objects array and check for new platforms every 200 frames
         if ($this.timeout === 0) {
             $this.timeout = 200;
             $this.allObjects = [];
         }
         //get objects if needed
         if ($this.allObjects.length === 0) {
             $this.allObjects = $this.scene.allChildren($this.scene.objects())
         }
         
         $this.timeout -= 1;
         var entityRole;
         var playerEntity = $this.scene.findRoles('player');
         var enemyEntity = $this.scene.findRoles('enemy');
         var ballEntity = $this.scene.findRoles('ball');
         if(entity == playerEntity[0]){
             entityRole = "player";
         } 
         for(var enemyNum = 0; enemyNum < enemyEntity.length; enemyNum++){
             if(entity == enemyEntity[enemyNum]){
                 entityRole = "enemy";
             }
         }
         for(var ballNum = 0; ballNum < ballEntity.length; ballNum++){
             if(entity == ballEntity[ballNum]){
                 entityRole = "ball";
             }
         }
         //check platforms
         const floors = $this.allObjects.filter(o => o.role() === "floor");
         for(let floor of floors){
             var platformX;
             var platformY;
             if(entityRole == "player"){
                 platformX = floor.x()-Math.abs($this.scene.x());
                 platformY = floor.y()-Math.abs($this.scene.y());
             } else {
                 platformX = floor.x();
                 platformY = floor.y();
             }
             var platformW = floor.width()*floor.scaleX();
             var platformH = floor.height()*floor.scaleY();
             
             if((platformY < entity.y()+entity.height()/2 && entity.y() <= platformY && entity.x()>platformX && entity.x()<platformX+platformW) && entity.motion != "up"){
                 if(entity == "ball"){
                     entity.mspeedY = -entity.mspeedY;
                 } else {
                     entity.mspeedY = 0;
                     entity.y(platformY-entity.height()/2);
                     entity.jump = false;
                     isCol = true;
                 }
             } else if ($this.scene.twoWayPlatform && (platformY+platformH > entity.y()-entity.height()/2 && entity.y() >= platformY && entity.x()>platformX && entity.x()<platformX+platformW)){
                 if(entity == "ball"){
                     entity.mspeedY = -entity.mspeedY;
                 } else {
                     isCol = true;
                     entity.mspeedY = 0;
                     entity.y(platformY+platformH+entity.height()/2);
                 }
                 
             }
         }
         
         //check walls
         var walls = $this.allObjects.filter(o => o.role() === "wall");
         for(let wall of walls){
             var wallX;
             var wallY;
             if(entityRole == "player"){
                 wallX = wall.x()-Math.abs($this.scene.x());
                 wallY = wall.y()-Math.abs($this.scene.y());
             } else {
                 wallX = wall.x();
                 wallY = wall.y();
             }
             var wallW = wall.width()*1;
             var wallH = wall.height()*1;
             
             if(wallX < entity.x()+entity.width()/2 && entity.x() <= wallX && entity.y()>wallY && entity.y()<wallY+wallH){
                 entity.x(wallX-entity.width()/2);
                 if(entityRole == "enemy"){
                     if(entity.scaleX()>0){
                         entity.scaleX(-entity.scaleX());
                     }
                     if(entity.sideMove == "right"){
                         entity.sideMove = "left";
                     } else {
                         entity.sideMove = "right";
                     }
                 }
             } else if(wallX+wallW > entity.x()-entity.width()/2 && entity.x() >= wallX+wallW && entity.y()>wallY && entity.y()<wallY+wallH){
                 entity.x(wallX+wallW+entity.width()/2);
                 if(entityRole == "enemy"){
                     if(entity.scaleX()<0){
                         entity.scaleX(-entity.scaleX());
                     }
                     if(entity.sideMove == "right"){
                         entity.sideMove = "left";
                     } else {
                         entity.sideMove = "right";
                     }
                 }
             }
         }
         
         //check ceiling
         var ceilings = $this.allObjects.filter(o => o.role() === "ceiling");
         for(let ceiling of ceilings){
             var ceilingX;
             var ceilingY;
             if(entityRole == "player"){
                 ceilingX = ceiling.x()-Math.abs($this.scene.x());
                 ceilingY = ceiling.y()-Math.abs($this.scene.y());
             } else {
                 ceilingX = ceiling.x();
                 ceilingY = ceiling.y();
             }
             var ceilingW = ceiling.width()*1;
             var ceilingH = ceiling.height()*1;
             
             if(ceilingY+ceilingH > entity.y()-entity.height()/2 && entity.y() >= ceilingY && entity.x()>ceilingX && entity.x()<ceilingX+ceilingW){
                 entity.mspeedY = 0;
                 entity.y(ceilingY+ceilingH+entity.height()/2);
             } 
         }
         return isCol;
     };
     
     $this.characterMove = function(character){
         if(!$this.scene){
             $this.scene = $this.scene;
         }
         var characterRole;
         if(character == $this.scene.findRoles('player')[0]){
             characterRole = "player";
         } 
         
         if($this.scene.scene.y()>0){
             $this.scene.scene.y(0);
         }
         
         if(character.motion != "static"){
             character.mspeedY+=9;
         }
         
         if(character.mspeedY > 0){
             character.motion = "down";
         } else if (character.mspeedY < 0){
             character.motion = "up";
         } else {
             character.motion = "static";
             character.jump = false;
         }
         
         if(characterRole == "player"){
             switch(character.motion){
                 case ("down"):
                     if($this.scene.y()>=-$this.scene.height()+$this.scene.height()*1 && character.y()>=$this.scene.height()/2){
                         $this.scene.moveY(-character.mspeedY);
                     } else if(character.y()<$this.scene.height() - character.height()/2){
                         character.moveY(character.mspeedY);
                     } else {
                         character.mspeedY = 0;
                         character.jump = false;
                     }
                     break;
                 case ("up"):
                     if($this.scene.y()<0 && character.y() <= $this.scene.height()/2){
                         $this.scene.moveY(-character.mspeedY);
                     } else if(character.y()>0+character.height()){
                         character.moveY(character.mspeedY);
                     } else {
                         character.mspeedY = 0;
                     }
                     break;
             }
         } else {
             switch(character.motion){
             case ("down"):
                 if(character.y()<$this.scene.height() - character.height()/2){
                     character.moveY(character.mspeedY);
                 } else {
                     character.mspeedY = 0;
                     character.jump = false;
                 }
                 break;
             case ("up"):
                 if(character.y()>0+character.height()/2){
                     character.moveY(character.mspeedY);
                 } else {
                     character.mspeedY = 0;
                 }
                 break;
             }
         }
     
         switch(character.sideMove){
             case ("left"):
                 if(characterRole == "player" && $this.scene.x()<0 && character.x() <= $this.scene.width()/2){
                     $this.scene.moveX(character.mspeedX);
                 } else {
                     character.moveX(-character.mspeedX);
                 }
                 break;
             case ("right"):
                 if(characterRole == "player" && $this.scene.x()>-$this.scene.width()+$this.scene.width()*1 && character.x() >= $this.scene.width()/2){
                     $this.scene.moveX(-character.mspeedX);
                 } else {
                     character.moveX(character.mspeedX);
                 }
                 break;
             default:
                 character.moveX(0);
         }
     };
     
     //PLAYER HIT
     
     $this.playerHit = function (player, role) {
         
         //get objects if needed
         if ($this.allObjects.length === 0) {
             $this.allObjects = $this.scene.allChildren($this.scene.objects());
         }
         
         //get objects with role
         var roleObjects = $this.allObjects.filter(obj => obj.role() === role);
         
         for (let roleObject of roleObjects){
             if (roleObject.isTouching(player)){
                 return roleObject;
             }
         }
         return null;
     };
     $this.hit = function (object, role) {
         return $this.playerHit(object,role);
     };
}`,

    "Platform Hit": `
    /**
        these functions are already included in the 'Platform Functions' code snippet
    **/
    
    //PLAYER HIT
    if ($this.scene.state() == "PLAY") {
    $this.allObjects = []
    $this.playerHit = function (player, role) {
        
        //get objects if needed
        if ($this.allObjects.length === 0) {
            $this.allObjects = $this.scene.allChildren($this.scene.objects());
        }
        
        //get objects with role
        var roleObjects = $this.allObjects.filter(obj => obj.role() === role);
        
        for (let roleObject of roleObjects){
            if (roleObject.isTouching(player)){
                return roleObject;
            }
        }
        return null;
    };
    $this.hit = function (object, role) {
        return $this.playerHit(object,role);
    };
}`,

    "Platform Hide": `
    //PLATFORM HIDE
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

    "Avatar Controls": `platforms.checkCollision($this);\nplatforms.characterMove($this);`
}

export default Dictionary;