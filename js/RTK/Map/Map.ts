import { RNG } from '../RNG';

class Map {
  constructor(width, height) {
    this._width=width;
    this._height=height
  }
  create(callback){};
  _fillMap(value){
    var map=[];
    for(var i=0;i<this._width;i++){
      map.push([]);
      for(var j=0;j<this._height;j++){
        map[i].push(value)
      }
    }
    return map
  };
};

export { Map }
