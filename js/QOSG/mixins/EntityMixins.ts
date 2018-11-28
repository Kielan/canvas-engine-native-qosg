import { QOSG } from '../index';

const EntityMixins={};
EntityMixins.PlayerActor={
  name:"PlayerActor",
  groupName:"Actor",
  act:function act(){
    if(this._acting){return}
    this._acting=true;
    if(!this.isAlive()){
//      Screen.playScreen.setGameEnded(true);
    }
    QOSG.refresh();
    this.getMap().getEngine().lock();
    this._acting=false
  }
};
EntityMixins.Sight={
  name: 'Sight',groupName: 'Sight',
  init: function(template) {this._sightRadius = template['sightRadius'] || 5;},
  getSightRadius: function() {
    return this._sightRadius;
  },
  increaseSightRadius: function(value) {
    value = value || 1;this._sightRadius += value;
  },
  canSee: function(entity) {
    if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {return false;}
  var otherX = entity.getX();
  var otherY = entity.getY();
  if((otherX-this._x)*(otherX-this._x)+(otherY-this._y)*(otherY-this._y)>this._sightRadius*this._sightRadius){return false}
  var found=false;
  this.getMap().getFov(this.getZ()).compute(this.getX(),this.getY(),this.getSightRadius(),function(x,y,radius,visibility){
    if(x===otherX&&y===otherY){found=true}}
  );
  return found
}
};
export { EntityMixins }
