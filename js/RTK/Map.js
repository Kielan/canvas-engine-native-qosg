class Arena {
   constructor(width, height) {
     this._width = width
     this._height = height
   }
   create(callback) {
     var w = this._width-1
     var h = this._height-1
     for (var i=0;i<=w;i++) {
       for (var j=0;j<=h;j++) {
         var empty = (i && j && i<w && j<h)
         callback(i, j, empty ? 0 : 1)
       }
     }
  return this
  }
}

export const Map = {
  _fillMap: function(value) {
    var map = [];
    for (var i=0;i<this._width;i++) {
      map.push([]);
      for (var j=0;j<this._height;j++) { map[i].push(value); }
    }
    return map;
  },
  Arena,
}
