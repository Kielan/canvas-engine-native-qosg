'use strict'
import {Color} from './Color'
import {Display} from './Display'
import {RTK_ASCII} from './ASCII'
/**
 * Left pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.lpad = String.prototype.lpad || function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return s+this;
}

/**
 * @namespace Top-level RTK namespace
 */
export const RTK = {
   _context: context,
   _data: {},
   _dirty: false, /* false = nothing, true = all, object = dirty cells */
   _options: {},
   /* Directional constants. Ordering is important! */
   DIRS: {
     "4": [
       [ 0, -1],
       [ 1,  0],
       [ 0,  1],
       [-1,  0]
     ],
     "8": [
       [ 0, -1],
       [ 1, -1],
       [ 1,  0],
       [ 1,  1],
       [ 0,  1],
       [-1,  1],
       [-1,  0],
       [-1, -1]
     ],
     "6": [
       [-1, -1],
       [ 1, -1],
       [ 2,  0],
       [ 1,  1],
       [-1,  1],
       [-2,  0]
     ]
   },
   Display,
   Color,
   RTK_ASCII,
 }
  export class Map extends RTK {
   constructor(width, height) {
     super(width, height)
     this._width = width
     this._height = height
   }
   _fillMap(value) {
   	var map = [];
   	for (var i=0;i<this._width;i++) {
   		map.push([]);
   		for (var j=0;j<this._height;j++) { map[i].push(value); }
   	}
   	return map;
   }

 }
 export class Arena extends Map {
   constructor(width, height) {
     super(width, height)
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
 //display is the screenview coordinates of the, "camera" on the map
