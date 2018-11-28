import { RTK } from '../../RTK';
import { Tile } from '../Tile';
import { EntityMixins } from '../mixins';

var Map = function(tiles) {
  this._tiles=tiles;
  this._depth=tiles.length;
  this._width=tiles[0].length;this._height=tiles[0][0].length;
  this._fov=[];
  this.setupFov();
  this._entities={};
  this._scheduler=new RTK.Speed;
  this._engine=new RTK.Engine(this._scheduler);
  this._explored=new Array(this._depth);
  this._setupExploredArray();
};
Map.prototype._setupExploredArray=function(){
  for(var z=0;z<this._depth;z++){
    this._explored[z]=new Array(this._width);
    for(var x=0;x<this._width;x++){
      this._explored[z][x]=new Array(this._height);
      for(var y=0;y<this._height;y++){
        this._explored[z][x][y]=false
      }
    }
  }
//  console.log('celeb fanbase', this._explored[0])
};
Map.prototype.getDepth=function(){return this._depth};
Map.prototype.getWidth=function(){return this._width};
Map.prototype.getHeight=function(){return this._height};
Map.prototype.getTile=function(x,y,z){
  if(x<0||x>=this._width||y<0||y>=this._height||z<0||z>=this._depth){
    return Tile.nullTile
  }else{
    return this._tiles[z][x][y]||Tile.nullTile
  }
};
Map.prototype.isEmptyFloor=function(x,y,z){
  return this.getTile(x,y,z)==Tile.floorTile&&!this.getEntityAt(x,y,z)
};
Map.prototype.isExplored=function(x,y,z){
  if(this.getTile(x,y,z)!==Tile.nullTile){
  return this._explored[z][x][y]
  } else {return false}
};
Map.prototype.getEngine=function(){return this._engine};
Map.prototype.getEntityAt=function(x,y,z){
  return this._entities[x+","+y+","+z]
};
Map.prototype.getRandomFloorPosition=function(z){
  var x,y;
  do {
    x=Math.floor(Math.random()*this._width);
    y=Math.floor(Math.random()*this._height)
  } while(!this.isEmptyFloor(x,y,z));
  return{x:x,y:y,z:z}
};
Map.prototype.addEntityAtRandomPosition=function(entity,z){
  console.log('Map.prototype.addEntityAtRandomPosition=function')
  var position=this.getRandomFloorPosition(z);
  entity.setX(position.x);
  entity.setY(position.y);
  entity.setZ(position.z);
  this.addEntity(entity)
};
Map.prototype.addEntity=function(entity){
  entity.setMap(this);
  this.updateEntityPosition(entity);
  if(entity.hasMixin("Actor")){this._scheduler.add(entity,true)}
  if(entity.hasMixin(EntityMixins.PlayerActor)){this._player=entity}
};
Map.prototype.updateEntityPosition=function(entity,oldX,oldY,oldZ){
  if(typeof oldX==="number"){var oldKey=oldX+","+oldY+","+oldZ;
  if(this._entities[oldKey]==entity){delete this._entities[oldKey]}}
  if(entity.getX()<0||entity.getX()>=this._width||entity.getY()<0||entity.getY()>=this._height||entity.getZ()<0||entity.getZ()>=this._depth){
    throw new Error("Entity's position is out of bounds.")
  }
  var key=entity.getX()+","+entity.getY()+","+entity.getZ();
  if(this._entities[key]){
    throw new Error("Tried to add an entity at an occupied position.")
  }
  this._entities[key]=entity
};
  Map.prototype.setupFov=function(){
    var map=this;
    for(var z=0;z<this._depth;z++){
      (function(){
      var depth=z;
      map._fov.push(
        new RTK.DiscreteShadowcasting(function(x,y){
          return map.getTile(x,y,depth) && !map.getTile(x,y,depth).isBlockingLight()},{topology:4}))
    })()}
  };
Map.prototype.getFov=function(depth){
  console.log('what is getfov', this._fov[depth])
  return this._fov[depth]
};
Map.prototype.setExplored=function(x,y,z,state){
  if(this.getTile(x,y,z) !== Tile.nullTile){
    this._explored[z][x][y]=state
  }
};
Map.Cave=function(tiles,player){
  Map.call(this,tiles);
  this.addEntityAtRandomPosition(player,0);
};

export { Map }
