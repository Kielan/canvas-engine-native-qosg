import { DynamicGlyph} from './DynamicGlyph';
import { EntityMixins } from './mixins';

class Entity extends DynamicGlyph {
  constructor(properties) {
    super(properties)
    properties=properties||{};
    this._x=properties["x"]||0;
    this._y=properties["y"]||0;
    this._z=properties["z"]||0;
    this._map=null;
    this._alive=true;
    this._speed=properties["speed"]||1000;
  };
  setX(x){this._x=x};
  setY(y){this._y=y};
  setZ(z){this._z=z};
  setMap(map){this._map=map};
  setSpeed(speed){this._speed=speed};
  setPosition(x,y,z){
    var oldX=this._x;var oldY=this._y;var oldZ=this._z;
    this._x=x;this._y=y;this._z=z;
    if(this._map){this._map.updateEntityPosition(this,oldX,oldY,oldZ)}
  };
  getX(){return this._x};
  getY(){return this._y};
  getZ(){return this._z};
  getMap(){return this._map};
  getSpeed(){return this._speed};
  tryMove(x,y,z,map){
    var map=this.getMap();
    var tile=map.getTile(x,y,this.getZ());
    var target=map.getEntityAt(x,y,this.getZ());
    if(z<this.getZ()){if(tile!=Tile.stairsUpTile){
      console.log(this,"You can't go up here!")
    }else{
      console.log(this,"You ascend to level %d!",[z+1]);
      this.setPosition(x,y,z)}
    }else if(z>this.getZ()){this.setPosition(x,y,z);
      console.log("You descend to level %d!",[z+1])
    }else if(target){
      if(this.hasMixin("Attacker")&&(this.hasMixin(EntityMixins.PlayerActor)||target.hasMixin(EntityMixins.PlayerActor))){
        this.attack(target);
        return true
      }
      return false
    } else if(tile.isWalkable()){
      this.setPosition(x,y,z);
      return true
    }
    return false
  };
  isAlive(){return this._alive};
  kill(message){
    if(!this._alive){return}
    this._alive=false;
    if(message){
      console.log('this,message')
    }else{
      console.log("You have died!")
    }if(this.hasMixin(EntityMixins.PlayerActor)){
      this.act()
    }else{
      this.getMap().removeEntity(this)
    }
  };
  switchMap(newMap){
    if(newMap===this.getMap()){return}
    this.getMap().removeEntity(this);
    this._x=0;
    this._y=0;
    this._z=0;
    newMap.addEntity(this)
  };
}

export { Entity }
