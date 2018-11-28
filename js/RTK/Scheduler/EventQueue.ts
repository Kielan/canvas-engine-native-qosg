
var EventQueue=function(){
  this._time=0;this._events=[];this._eventTimes=[]
};
EventQueue.prototype.getTime=function(){return this._time};
EventQueue.prototype.clear=function(){this._events=[];this._eventTimes=[];return this};
EventQueue.prototype.add=function(event,time){var index=this._events.length;for(var i=0;i<this._eventTimes.length;i++){if(this._eventTimes[i]>time){index=i;break}}this._events.splice(index,0,event);this._eventTimes.splice(index,0,time)};
EventQueue.prototype.get=function(){if(!this._events.length){return null}var time=this._eventTimes.splice(0,1)[0];if(time>0){this._time+=time;for(var i=0;i<this._eventTimes.length;i++){this._eventTimes[i]-=time}}return this._events.splice(0,1)[0]};
EventQueue.prototype.getEventTime=function(event){var index=this._events.indexOf(event);if(index==-1){return undefined}return this._eventTimes[index]};
EventQueue.prototype.remove=function(event){var index=this._events.indexOf(event);if(index==-1){return false}this._remove(index);return true};
EventQueue.prototype._remove=function(index){this._events.splice(index,1);this._eventTimes.splice(index,1)};

export { EventQueue }
