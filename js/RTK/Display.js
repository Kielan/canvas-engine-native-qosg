'use strict'
import {findNodeHandle, Platform, NativeModules} from 'react-native'
import {GCanvasView} from 'react-native-gcanvas'
import {enable, Image as GImage, ReactNativeBridge} from 'gcanvas.js/src/index.js'
import {RTK_ASCII} from './ASCII'
import {Rect} from './Rect'
import {RTK} from './rtk'
ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule
ReactNativeBridge.Platform = Platform

String.prototype.capitalize = String.prototype.capitalize || function() {
	return this.charAt(0).toUpperCase() + this.substring(1);
}
//display is the screenview coordinates of the, "camera" on the map
RTK.Display = function(options, refName) {

    var ref = refName//this.refs.canvas_holder_ref
    var canvas_tag = findNodeHandle(refName)
    var el = { ref:""+canvas_tag, style:{width: options.width, height: options.height}}
    ref = enable(el, {bridge: ReactNativeBridge})
    this._context = refName.getContext('2d')
		//doesn't exactly match web api currently just adding
		//width and height manually
		this._context.canvas = {width: ref.width, height: ref.height}

	//	this._context.fillText("Hello World!@#$%^&*()_+-=",10,50)

    this._backend = null
    this._data = {}
		this._dirty = false
    this._options = {}

    this.defaultOptions = {
      width: 120,
      height: 120,
      transpose: false,
      layout: "rect",
      fontSize: 15,
      spacing: 1,
      border: 0,
      forceSquareRatio: false,
      fontFamily: "monospace",
      fontStyle: "",
      fg: "#fff",
      bg: "#000",
      tileWidth: 32,
      tileHeight: 32,
      tileMap: {},
      tileSet: null,
      tileColorize: false,
      termColor: "xterm"
    }
    for (var p in options) { this.defaultOptions[p] = options[p] }

		this.setOptions = this.setOptions.bind(this)
		this._tick = this._tick.bind(this)


		this.setOptions(this.defaultOptions)

    requestAnimationFrame(this._tick)
}
RTK.Display.prototype.getContainer = function() {
  return this._context
}
RTK.Display.prototype._draw = function(key, clearBefore) {
  var data = this._data[key]
  if (data[4] != this._options.bg) { clearBefore = true }

	console.log('display._draw analytical overlay')
  this._backend.draw(data, clearBefore)
}
RTK.Display.prototype.setOptions = function(options) {
  for (var p in options) { this._options[p] = options[p] }
  if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
    if (options.layout) {
			console.log('prequel to the most fussy compute operation of all time')
      this._backend = new Rect(this._context)
    }

    var font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily
    this._context.font = font

		//fortest
//			this._context.fillText("Hello World!@#$%^&*()_+-=",10,50)
		console.log('the most fussy compute operation of all time')
    this._backend.compute(this._options)
    this._context.font = font
    this._context.textAlign = "center"
    this._context.textBaseline = "middle"
    this._dirty = true
  }
  return this
}
RTK.Display.prototype.draw = function(x, y, ch, fg, bg) {
  if (!fg) { fg = this._options.fg }
  if (!bg) { bg = this._options.bg }
  this._data[x+","+y] = [x, y, ch, fg, bg]

	console.log('Display.draw method', this._data)

  if (this._dirty === true) { return } /* will already redraw everything */
  if (!this._dirty) { this._dirty = {} } /* first! */
  this._dirty[x+","+y] = true
}
RTK.Display.prototype.drawText = function(x, y, text, maxWidth) {
 console.log('drawText')
 var fg = null;
 var bg = null;
 var cx = x;
 var cy = y;
 var lines = 1;
 if (!maxWidth) { maxWidth = this._options.width-x; }

 var tokens = RTK_ASCII.tokenize(text, maxWidth)

console.log('drawText tokens', tokens.length)

 while (tokens.length) { /* interpret tokenized opcode stream */
   var token = tokens.shift()
//   console.log('while tokens', token)
 switch (token.type) {
 	case RTK_ASCII.TYPE_TEXT:
		console.log('while switch case 0 TYPE_TEXT', token)
		var isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false
		for (var i=0;i<token.value.length;i++) {
			var cc = token.value.charCodeAt(i)
			var c = token.value.charAt(i)

	 		console.log('while switch case token cc', cc, 'c yo', c)
	   	// Assign to `true` when the current char is full-width.
	   	isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee
	   	// Current char is space, whatever full-width or half-width both are OK.
	   	isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
	   	// The previous char is full-width and
		   // current char is nether half-width nor a space.
		   if (isPrevFullWidth && !isFullWidth && !isSpace) { cx++; } // add an extra position
		   // The current char is full-width and
		   // the previous char is not a space.
		   if(isFullWidth && !isPrevSpace) { cx++; } // add an extra position

			 console.log('just b4 this.draw', this.draw)
		   this.draw(cx++, cy, c, fg, bg)
		   isPrevSpace = isSpace
		   isPrevFullWidth = isFullWidth
	 	}
	 	console.log('just b4 switch break', this._data)
   	break;

   	case RTK_ASCII.TYPE_FG:
   	fg = token.value || null;
   	break;

   	case RTK_ASCII.TYPE_BG:
   	bg = token.value || null;
   	break;

		case RTK_ASCII.TYPE_NEWLINE:
		cx = x;
		cy++;
		lines++;
		break;
   }
 }

 return lines
};
RTK.Display.prototype._tick = function() {
   requestAnimationFrame(this._tick)
   if (!this._dirty) {console.log('_tick !this._dirty '); return; }
   if (this._dirty === true) { /* draw all */
     this._context.fillStyle = this._options.bg
     this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height)

		 console.log('_tick redraw cached data ', this._data)
     for (var id in this._data) { /* redraw cached data */
       this._draw(id, false)
     }
   } else { /* draw only dirty */
     for (var key in this._dirty) {
       this._draw(key, true)
     }
   }
   this._dirty = false
 }
 RTK.Display.prototype._drawNoCache = function(data, clearBefore) {
   var x = data[0]
   var y = data[1]
   var ch = data[2]
   var fg = data[3]
   var bg = data[4]

   if (clearBefore) {
     var b = this._options.border
     this._context.fillStyle = bg
     this._context.fillRect(x*this._spacingX + b, y*this._spacingY + b, this._spacingX - b, this._spacingY - b)
   }

   if (!ch) { return; }

   this._context.fillStyle = fg

   var chars = [].concat(ch)
   for (var i=0;i<chars.length;i++) {
     this._context.fillText(chars[i], (x+0.5) * this._spacingX, Math.ceil((y+0.5) * this._spacingY))
   }
 }
