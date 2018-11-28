//import {} from '';

var QOSGControl = function(RTK) {

  var QOSG={
    _display:null,_currentScreen:null,_screenWidth:400,_screenHeight:700,
    init:function init(refName){
      this._display=new RTK.Display({width:this._screenWidth,height:this._screenHeight+1,refName:refName});
      this.nodeHandle=this._display.getNodeHandle();
      this.refBridge=this._isplay.getRefBridge();
      return this
    },
    getDisplay:function getDisplay(){return this._display},
    getScreenWidth:function getScreenWidth(){return this._screenWidth},
    getScreenHeight:function getScreenHeight(){return this._screenHeight},
    getContext:function getContext(){return this._display._context},
    getNodeHandle:function getNodeHandle(){return this.nodeHandle},
    getRefBridge:function getRefBridge(){return this.refBridge},
    refresh:function refresh(){
      this._display.clear();
      console.log('finally refresh the screen', this._display.canvas.height);
      this._currentScreen.render(this._display);
    },
    switchScreen:function switchScreen(screen){if(this._currentScreen!==null){this._currentScreen.exit()}this.getDisplay().clear();this._currentScreen=screen;if(!this._currentScreen!==null){this._currentScreen.enter();this.refresh()}},
    renderCanvasFactory:function renderCanvasFactory(tileMap){var correctScope=this._display.getContainer();var stringmap=tileMap.map(function(textRow){return textRow.map(function(item){return item._char})});stringmap.map(function(textRow,i){return textRow.map(function(textInstance,j){return correctScope.fillText(textInstance,10*i,10)})})}
  };
  QOSG.Map=function(tiles){this._tiles=tiles;this._depth=tiles.length;this._width=tiles[0].length;this._height=tiles[0][0].length;this._fov=[];this.setupFov();this._entities={};this._scheduler=new RTK.Scheduler.Speed;this._engine=new RTK.Engine(this._scheduler);this._explored=new Array(this._depth);this._setupExploredArray();};QOSG.Map.prototype._setupExploredArray=function(){for(var z=0;z<this._depth;z++){this._explored[z]=new Array(this._width);for(var x=0;x<this._width;x++){this._explored[z][x]=new Array(this._height);for(var y=0;y<this._height;y++){this._explored[z][x][y]=false}}}};QOSG.Map.prototype.addEntity=function(entity){entity.setMap(this);this.updateEntityPosition(entity);if(entity.hasMixin("Actor")){this._scheduler.add(entity,true)}if(entity.hasMixin(QOSG.EntityMixins.PlayerActor)){this._player=entity}};QOSG.Map.prototype.getDepth=function(){return this._depth};
  QOSG.Map.prototype.getWidth=function(){return this._width};
  QOSG.Map.prototype.getHeight=function(){return this._height};
  QOSG.Map.prototype.getTile=function(x,y,z){if(x<0||x>=this._width||y<0||y>=this._height||z<0||z>=this._depth){return QOSG.Tile.nullTile}else{return this._tiles[z][x][y]||QOSG.Tile.nullTile}};
  QOSG.Map.prototype.dig=function(x,y,z){if(this.getTile(x,y,z).isDiggable()){this._tiles[z][x][y]=QOSG.Tile.floorTile}};
  QOSG.Map.prototype.isEmptyFloor=function(x,y,z){return this.getTile(x,y,z)==QOSG.Tile.floorTile&&!this.getEntityAt(x,y,z)};
  QOSG.Map.prototype.isExplored=function(x,y,z){if(this.getTile(x,y,z)!==QOSG.Tile.nullTile){return this._explored[z][x][y]}else{return false}};
  QOSG.Map.prototype.getEngine=function(){return this._engine};
  QOSG.Map.prototype.getEntityAt=function(x,y,z){return this._entities[x+","+y+","+z]};
  QOSG.Map.prototype.getRandomFloorPosition=function(z){var x,y;do{x=Math.floor(Math.random()*this._width);y=Math.floor(Math.random()*this._height)}while(!this.isEmptyFloor(x,y,z));return{x:x,y:y,z:z}};QOSG.Map.prototype.addEntityAtRandomPosition=function(entity,z){var position=this.getRandomFloorPosition(z);entity.setX(position.x);entity.setY(position.y);entity.setZ(position.z);this.addEntity(entity)};QOSG.Map.prototype.addEntity=function(entity){entity.setMap(this);this.updateEntityPosition(entity);if(entity.hasMixin("Actor")){this._scheduler.add(entity,true)}if(entity.hasMixin(QOSG.EntityMixins.PlayerActor)){this._player=entity}};QOSG.Map.prototype.updateEntityPosition=function(entity,oldX,oldY,oldZ){if(typeof oldX==="number"){var oldKey=oldX+","+oldY+","+oldZ;if(this._entities[oldKey]==entity){delete this._entities[oldKey]}}if(entity.getX()<0||entity.getX()>=this._width||entity.getY()<0||entity.getY()>=this._height||entity.getZ()<0||entity.getZ()>=this._depth){throw new Error("Entity's position is out of bounds.")}var key=entity.getX()+","+entity.getY()+","+entity.getZ();if(this._entities[key]){throw new Error("Tried to add an entity at an occupied position.")}this._entities[key]=entity};QOSG.Map.prototype.setupFov=function(){var map=this;for(var z=0;z<this._depth;z++){(function(){var depth=z;map._fov.push(new RTK.FOV.DiscreteShadowcasting(function(x,y){return!map.getTile(x,y,depth).isBlockingLight()},{topology:4}))})()}};
  QOSG.Map.prototype.getFov=function(depth){
    console.log('what is getfov', this._fov[depth])
    return this._fov[depth]
  };
  QOSG.Map.prototype.setExplored=function(x,y,z,state){if(this.getTile(x,y,z)!==QOSG.Tile.nullTile){this._explored[z][x][y]=state}};
  QOSG.Map.Cave=function(tiles,player){
    QOSG.Map.call(this,tiles);
    this.addEntityAtRandomPosition(player,0);
  };
  QOSG.Map.Cave.extend(QOSG.Map);
  QOSG.Builder=function(width,height,depth){
    this._width=width;this._height=height;this._depth=depth;
    this._tiles=new Array(depth);this._regions=new Array(depth);
    for(var z=0;z<depth;z++){this._tiles[z]=this._generateLevel()}
  };
  QOSG.Builder.prototype.getTiles=function(){return this._tiles};
  QOSG.Builder.prototype.getDepth=function(){return this._depth};
  QOSG.Builder.prototype.getWidth=function(){return this._width};
  QOSG.Builder.prototype.getHeight=function(){return this._height};
  QOSG.Builder.prototype._generateLevel=function(){
    var map=new Array(this._width);
    for(var w=0;w<this._width;w++){
      map[w]=new Array(this._height)}
    var generator=new RTK.Map.Cellular(this._width,this._height);
    generator.randomize(0.5);
    var totalIterations=3;
    for(var i=0;i<totalIterations-1;i++){
      generator.create()}
    generator.create(function(x,y,v){
      if(v===1){map[x][y]=QOSG.Tile.floorTile
      }else{
        map[x][y]=QOSG.Tile.wallTile}
      });

      return map
  };
  QOSG.Builder.prototype._canFillRegion=function(x,y,z){if(x<0||y<0||z<0||x>=this._width||y>=this._height||z>=this._depth){return false}if(this._regions[z][x][y]!=0){return false}return this._tiles[z][x][y].isWalkable()};
  QOSG.Builder.prototype._fillRegion=function(region,x,y,z){var tilesFilled=1;var tiles=[{x:x,y:y}];var tile;var neighbors;this._regions[z][x][y]=region;while(tiles.length>0){tile=tiles.pop();neighbors=QOSG.getNeighborPositions(tile.x,tile.y);while(neighbors.length>0){tile=neighbors.pop();if(this._canFillRegion(tile.x,tile.y,z)){this._regions[z][tile.x][tile.y]=region;tiles.push(tile);tilesFilled++}}}return tilesFilled};
  QOSG.Builder.prototype._removeRegion=function(region,z){for(var x=0;x<this._width;x++){for(var y=0;y<this._height;y++){if(this._regions[z][x][y]==region){this._regions[z][x][y]=0;this._tiles[z][x][y]=QOSG.Tile.wallTile}}}};
  QOSG.Builder.prototype._setupRegions=function(z){var region=1;var tilesFilled;for(var x=0;x<this._width;x++){for(var y=0;y<this._height;y++){if(this._canFillRegion(x,y,z)){tilesFilled=this._fillRegion(region,x,y,z);if(tilesFilled<=20){this._removeRegion(region,z)}else{region++}}}}};
  QOSG.Builder.prototype._findRegionOverlaps=function(z,r1,r2){var matches=[];for(var x=0;x<this._width;x++){for(var y=0;y<this._height;y++){if(this._tiles[z][x][y]==QOSG.Tile.floorTile&&this._tiles[z+1][x][y]==QOSG.Tile.floorTile&&this._regions[z][x][y]==r1&&this._regions[z+1][x][y]==r2){matches.push({x:x,y:y})}}}return matches.randomize()};
  QOSG.Builder.prototype._connectRegions=function(z,r1,r2){var overlap=this._findRegionOverlaps(z,r1,r2);if(overlap.length==0){return false}var point=overlap[0];this._tiles[z][point.x][point.y]=QOSG.Tile.stairsDownTile;this._tiles[z+1][point.x][point.y]=QOSG.Tile.stairsUpTile;return true};
  QOSG.Builder.prototype._connectAllRegions=function(){for(var z=0;z<this._depth-1;z++){var connected={};var key;for(var x=0;x<this._width;x++){for(var y=0;y<this._height;y++){key=this._regions[z][x][y]+","+this._regions[z+1][x][y];if(this._tiles[z][x][y]==QOSG.Tile.floorTile&&this._tiles[z+1][x][y]==QOSG.Tile.floorTile&&!connected[key]){this._connectRegions(z,this._regions[z][x][y],this._regions[z+1][x][y]);connected[key]=true}}}}};
  QOSG.EntityMixins={};
  QOSG.EntityMixins.PlayerActor={
    name:"PlayerActor",groupName:"Actor",
    act:function act(){
    if(this._acting){return}
    this._acting=true;
    if(!this.isAlive()){QOSG.Screen.playScreen.setGameEnded(true);
      QOSG.sendMessage(this,"Press [Enter] to continue!")}
      QOSG.refresh();
      this.getMap().getEngine().lock();
      this._acting=false
    }
  };
  QOSG.EntityMixins.Sight={
    name: 'Sight',groupName: 'Sight',
    init: function(template) {this._sightRadius = template['sightRadius'] || 5;},
    getSightRadius: function() {return this._sightRadius;},
    increaseSightRadius: function(value) {value = value || 1;this._sightRadius += value;},
    canSee: function(entity) {if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {return false;}var otherX = entity.getX();var otherY = entity.getY();if((otherX-this._x)*(otherX-this._x)+(otherY-this._y)*(otherY-this._y)>this._sightRadius*this._sightRadius){return false}var found=false;this.getMap().getFov(this.getZ()).compute(this.getX(),this.getY(),this.getSightRadius(),function(x,y,radius,visibility){if(x===otherX&&y===otherY){found=true}});return found}
  };
  QOSG.Glyph=function(properties){properties=properties||{};this._char=properties["character"]||" ";this._foreground=properties["foreground"]||"white";this._background=properties["background"]||"black"};
  QOSG.Glyph.prototype.getChar=function(){return this._char};
  QOSG.Glyph.prototype.getBackground=function(){return this._background};
  QOSG.Glyph.prototype.getForeground=function(){return this._foreground};
  QOSG.Glyph.prototype.getRepresentation=function(){return"%c{"+this._foreground+"}%b{"+this._background+"}"+this._char+"%c{white}%b{black}"};
  QOSG.DynamicGlyph=function(properties){properties=properties||{};QOSG.Glyph.call(this,properties);this._name=properties["name"]||"";this._attachedMixins={};this._attachedMixinGroups={};this._listeners={};var mixins=properties["mixins"]||[];for(var i=0;i<mixins.length;i++){for(var key in mixins[i]){if(key!="init"&&key!="name"&&key!="listeners"&&!this.hasOwnProperty(key)){this[key]=mixins[i][key]}}this._attachedMixins[mixins[i].name]=true;if(mixins[i].groupName){this._attachedMixinGroups[mixins[i].groupName]=true}if(mixins[i].listeners){for(var key in mixins[i].listeners){if(!this._listeners[key]){this._listeners[key]=[]}this._listeners[key].push(mixins[i].listeners[key])}}if(mixins[i].init){mixins[i].init.call(this,properties)}}};
  QOSG.DynamicGlyph.extend(QOSG.Glyph);
  QOSG.DynamicGlyph.prototype.hasMixin=function(obj){if(_typeof(obj)==="object"){return this._attachedMixins[obj.name]}else{return this._attachedMixins[obj]||this._attachedMixinGroups[obj]}};
  QOSG.DynamicGlyph.prototype.setName=function(name){this._name=name};
  QOSG.DynamicGlyph.prototype.getName=function(){return this._name};
  QOSG.DynamicGlyph.prototype.describe=function(){return this._name};
  QOSG.DynamicGlyph.prototype.describeA=function(capitalize){var prefixes=capitalize?["A","An"]:["a","an"];var string=this.describe();var firstLetter=string.charAt(0).toLowerCase();var prefix="aeiou".indexOf(firstLetter)>=0?1:0;return prefixes[prefix]+" "+string};
  QOSG.DynamicGlyph.prototype.describeThe=function(capitalize){var prefix=capitalize?"The":"the";return prefix+" "+this.describe()};
  QOSG.DynamicGlyph.prototype.raiseEvent=function(event){if(!this._listeners[event]){return}var args=Array.prototype.slice.call(arguments,1);var results=[];for(var i=0;i<this._listeners[event].length;i++){results.push(this._listeners[event][i].apply(this,args))}return results};
  QOSG.DynamicGlyph.prototype.details=function(){var details=[];var detailGroups=this.raiseEvent("details");if(detailGroups){for(var i=0,l=detailGroups.length;i<l;i++){if(detailGroups[i]){for(var j=0;j<detailGroups[i].length;j++){details.push(detailGroups[i][j].key+": "+detailGroups[i][j].value)}}}}return details.join(", ")};
  QOSG.PlayerTemplate={name:"human (you)",character:"@",foreground:"white",maxHp:40,attackValue:10,sightRadius:11,inventorySlots:22,mixins:[QOSG.EntityMixins.PlayerActor,QOSG.EntityMixins.Sight]};
  QOSG.Tile=function(properties){properties=properties||{};
  QOSG.Glyph.call(this,properties);
  this._walkable=properties["walkable"]||false;this._diggable=properties["diggable"]||false;this._blocksLight=properties["blocksLight"]!==undefined?properties["blocksLight"]:true;this._description=properties["description"]||""};
  QOSG.Tile.extend(QOSG.Glyph);
  QOSG.Tile.prototype.isWalkable=function(){return this._walkable};
  QOSG.Tile.prototype.isDiggable=function(){return this._diggable};
  QOSG.Tile.prototype.isBlockingLight=function(){return this._blocksLight};
  QOSG.Tile.nullTile=new QOSG.Tile({description:"(unknown)"});
  QOSG.Tile.floorTile=new QOSG.Tile({character:".",walkable:true,blocksLight:false,description:"A cave floor"});
  QOSG.Tile.wallTile=new QOSG.Tile({character:"#",foreground:"goldenrod",diggable:true,description:"A cave wall"});
  QOSG.Tile.stairsUpTile=new QOSG.Tile({character:"<",foreground:"white",walkable:true,blocksLight:false,description:"A rock staircase leading upwards"});
  QOSG.Tile.stairsDownTile=new QOSG.Tile({character:">",foreground:"white",walkable:true,blocksLight:false,description:"A rock staircase leading downwards"});
  QOSG.getNeighborPositions=function(x,y){var tiles=[];for(var dX=-10;dX<2;dX++){for(var dY=-10;dY<2;dY++){if(dX==0&&dY==0){continue}tiles.push({x:x+dX,y:y+dY})}}return tiles.randomize()};
  QOSG.Entity=function(properties){properties=properties||{};QOSG.DynamicGlyph.call(this,properties);this._x=properties["x"]||0;this._y=properties["y"]||0;this._z=properties["z"]||0;this._map=null;this._alive=true;this._speed=properties["speed"]||1000};
  QOSG.Entity.extend(QOSG.DynamicGlyph);
  QOSG.Entity.prototype.setX=function(x){this._x=x};
  QOSG.Entity.prototype.setY=function(y){this._y=y};
  QOSG.Entity.prototype.setZ=function(z){this._z=z};
  QOSG.Entity.prototype.setMap=function(map){this._map=map};
  QOSG.Entity.prototype.setSpeed=function(speed){this._speed=speed};
  QOSG.Entity.prototype.setPosition=function(x,y,z){var oldX=this._x;var oldY=this._y;var oldZ=this._z;this._x=x;this._y=y;this._z=z;if(this._map){this._map.updateEntityPosition(this,oldX,oldY,oldZ)}};
  QOSG.Entity.prototype.getX=function(){return this._x};
  QOSG.Entity.prototype.getY=function(){return this._y};
  QOSG.Entity.prototype.getZ=function(){return this._z};
  QOSG.Entity.prototype.getMap=function(){return this._map};
  QOSG.Entity.prototype.getSpeed=function(){return this._speed};
  QOSG.Entity.prototype.tryMove=function(x,y,z,map){var map=this.getMap();var tile=map.getTile(x,y,this.getZ());var target=map.getEntityAt(x,y,this.getZ());if(z<this.getZ()){if(tile!=QOSG.Tile.stairsUpTile){QOSG.sendMessage(this,"You can't go up here!")}else{QOSG.sendMessage(this,"You ascend to level %d!",[z+1]);this.setPosition(x,y,z)}}else if(z>this.getZ()){this.setPosition(x,y,z);QOSG.sendMessage(this,"You descend to level %d!",[z+1])}else if(target){if(this.hasMixin("Attacker")&&(this.hasMixin(QOSG.EntityMixins.PlayerActor)||target.hasMixin(QOSG.EntityMixins.PlayerActor))){this.attack(target);return true}return false}else if(tile.isWalkable()){this.setPosition(x,y,z);return true}else if(tile.isDiggable()){if(this.hasMixin(QOSG.EntityMixins.PlayerActor)){map.dig(x,y,z);return true}return false}return false};
  QOSG.Entity.prototype.isAlive=function(){return this._alive};
  QOSG.Entity.prototype.kill=function(message){if(!this._alive){return}this._alive=false;if(message){QOSG.sendMessage(this,message)}else{QOSG.sendMessage(this,"You have died!")}if(this.hasMixin(QOSG.EntityMixins.PlayerActor)){this.act()}else{this.getMap().removeEntity(this)}};
  QOSG.Entity.prototype.switchMap=function(newMap){if(newMap===this.getMap()){return}this.getMap().removeEntity(this);this._x=0;this._y=0;this._z=0;newMap.addEntity(this)};QOSG.Screen={};
  QOSG.Screen.startScreen={enter:function enter(){console.log("Entered start screen.")},exit:function exit(){console.log("Exited start screen.")},render:function render(display){display.drawText(1,1,"%c{yellow}Javasc Roguelike");display.drawText(1,2,"Press [Enter] to start!")}};
  QOSG.Screen.playScreen={
    _player:null,_gameEnded:false,_subScreen:null,
    enter:function enter(){var width=150;var height=200;var depth=6;this._player=new QOSG.Entity(QOSG.PlayerTemplate);var tiles=new QOSG.Builder(width,height,depth).getTiles(); var map=new QOSG.Map.Cave(tiles,this._player);map.getEngine().start();},exit:function exit(){console.log("Exited play screen.")},
    render:function render(display){this.renderTiles(display)},
    getScreenOffsets:function getScreenOffsets(){
      var topLeftX=Math.max(0,this._player.getX()-QOSG.getScreenWidth()/2);
      var topLeftX2=Math.min(topLeftX,this._player.getMap().getWidth()-QOSG.getScreenWidth());
      var topLeftY=Math.max(0,this._player.getY()-QOSG.getScreenHeight()/2);
      var topLeftY2=Math.min(topLeftY,this._player.getMap().getHeight()-QOSG.getScreenHeight());
      console.log('._playerxy', this._player.getX(), this._player.getY());
      return{x:0,y:0}},
    renderTiles:function renderTiles(display){
      var screenWidth=QOSG.getScreenWidth();
      var screenHeight=QOSG.getScreenHeight();
      var offsets=this.getScreenOffsets();
      var topLeftX=0//offsets.x;
      var topLeftY=0//offsets.y;
      /*
      This section needs to be changed, draw must take an arg other than topLeftX,
      thtat is the offset of the player
      */
      //THE BUG IS AROUND MAYBE ABOVE HERE
      var map=this._player.getMap();
      var currentDepth=this._player.getZ();
      var visibleCells = {};
//      console.log('kielan rendertiles', this._player.getSightRadius())
      map.getFov(currentDepth).compute(this._player.getX(),this._player.getY(),this._player.getSightRadius(),function(x,y,radius,visibility){
        visibleCells[x+","+y]=true;
        map.setExplored(x,y,currentDepth,true)
      });
      for(var x=topLeftX;x<topLeftX+screenWidth;x++){
        for(var y=topLeftY;y<topLeftY+screenHeight;y++){
          if(map.isExplored(x,y,currentDepth)){
            console.log('rendertiles isExplored :)', x, y)
            var glyph=map.getTile(x,y,currentDepth);
            var foreground=glyph.getForeground();

            if(visibleCells[x+","+y]){
              if(map.getEntityAt(x,y,currentDepth)){
              glyph=map.getEntityAt(x,y,currentDepth)}foreground=glyph.getForeground()
            }else{
              foreground="darkGray"
            }

            display.draw(x,y,glyph.getChar(),foreground,glyph.getBackground())}
        }
      }}
  };
  QOSG.Screen.TargetBasedScreen=function(template){template=template||{};this._isAcceptableFunction=template["okFunction"]||function(x,y){return false};this._captionFunction=template["captionFunction"]||function(x,y){return""}};
  QOSG.Screen.TargetBasedScreen.prototype.setup=function(player,startX,startY,offsetX,offsetY){this._player=player;this._startX=startX-offsetX;this._startY=startY-offsetY;this._cursorX=this._startX;this._cursorY=this._startY;this._offsetX=offsetX;this._offsetY=offsetY;var visibleCells={};this._player.getMap().getFov(this._player.getZ()).compute(this._player.getX(),this._player.getY(),this._player.getSightRadius(),function(x,y,radius,visibility){visibleCells[x+","+y]=true});this._visibleCells=visibleCells};
  QOSG.Screen.TargetBasedScreen.prototype.render=function(display){QOSG.Screen.playScreen.renderTiles.call(QOSG.Screen.playScreen,display);};QOSG.Screen.lookScreen=new QOSG.Screen.TargetBasedScreen({captionFunction:function captionFunction(x,y){var z=this._player.getZ();var map=this._player.getMap();if(map.isExplored(x,y,z)){if(this._visibleCells[x+","+y]){if(map.getEntityAt(x,y,z)){var entity=map.getEntityAt(x,y,z);return String.format("%s - %s (%s)",entity.getRepresentation(),entity.describeA(true),entity.details())}}return String.format("%s - %s",map.getTile(x,y,z).getRepresentation(),map.getTile(x,y,z).getDescription())}else{return String.format("%s - %s",QOSG.Tile.nullTile.getRepresentation(),QOSG.Tile.nullTile.getDescription())}}});

  return QOSG
}
