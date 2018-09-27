import {RTK} from './rtk'
RTK.Map.Arena = function(width, height) {
	RTK.Map.call(this, width, height)
};
RTK.Map.Arena.extend(RTK.Map)
RTK.Map.Arena.prototype.create = function(callback) {
	var w = this._width-1
	var h = this._height-1
	for (var i=0;i<=w;i++) {
		for (var j=0;j<=h;j++) {
			var empty = (i && j && i<w && j<h)
			callback(i, j, empty ? 0 : 1)
		}
	}
	return this
};
RTK.prototype.Map = function(width, height) {
  this._width = width || RTK.DEFAULT_WIDTH
  this._height = height || RTK.DEFAULT_HEIGHT
}
RTK.Map.prototype.create = function(callback) {};
RTK.prototype._fillMap = function(value) {
  var map = []
  for (var i=0;i<this._width;i++) {
    map.push([])
    for (var j=0;j<this._height;j++) { map[i].push(value); }
  }
  return map
}
