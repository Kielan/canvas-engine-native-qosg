var Engine=function(scheduler){
  this._scheduler=scheduler;this._lock=1
};
Engine.prototype.start=function(){return this.unlock()};
Engine.prototype.lock=function(){this._lock++;return this};
Engine.prototype.unlock=function(){
  if(!this._lock){
  throw new Error("Cannot unlock unlocked engine")
  }
  this._lock--;while(!this._lock){
    var actor=this._scheduler.next();
    if(!actor){return this.lock()
  };
  var result=actor.act();
  if(result&&result.then){
    this.lock();
    result.then(this.unlock.bind(this))}
  }
  return this
};

export { Engine }
