import { EventQueue } from './EventQueue';

class Scheduler {
  constructor() {
    this._queue=new EventQueue;
    this._repeat=[];
    this._current=null
  }
  getTime=function(){return this._queue.getTime()};
  add(item,repeat){if(repeat){
    this._repeat.push(item)}return this
  };
  getTimeOf=function(item){return this._queue.getEventTime(item)};
  clear=function(){
    this._queue.clear();
    this._repeat=[];
    this._current=null;
    return this
  };
  remove=function(item){
    var result=this._queue.remove(item);
    var index=this._repeat.indexOf(item);
    if(index!=-1){this._repeat.splice(index,1)}
    if(this._current==item){this._current=null}
    return result
  };
  next=function(){this._current=this._queue.get();return this._current};
};

class Speed extends Scheduler {
  add(item,repeat,time){
    this._queue.add(item,time!==undefined?time:1/item.getSpeed());
    return super.add.call(this,item,repeat)
  };
  next(){
    if(this._current&&this._repeat.indexOf(this._current)!=-1){
      this._queue.add(this._current,1/this._current.getSpeed())
    }
    return super.next.call(this)
  };
}

export {
  Scheduler,
  Speed
}
