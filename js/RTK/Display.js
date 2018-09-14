'use strict'
import {findNodeHandle, Platform, NativeModules} from 'react-native'
import {GCanvasView} from 'react-native-gcanvas'
import {enable, Image as GImage, ReactNativeBridge} from 'gcanvas.js/src/index.js'

//display is the screenview coordinates of the, "camera" on the map
export class Display {
 constructor(options, refName) {

   ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule
   ReactNativeBridge.Platform = Platform
   var ref = refName//this.refs.canvas_holder_ref
   var canvas_tag = findNodeHandle(refName)
   var el = { ref:""+canvas_tag, style:{width:414, height:376}}
   ref = enable(el, {bridge: ReactNativeBridge})
   this._context = ref.getContext('2d')

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
     fg: "#ccc",
     bg: "#000",
     tileWidth: 32,
     tileHeight: 32,
     tileMap: {},
     tileSet: null,
     tileColorize: false,
     termColor: "xterm"
   }
   this._tick = this._tick.bind(this)
   requestAnimationFrame(this._tick)
 }
 getContainer = () => {
    return this._context.canvas;
 }
 draw(x, y, ch, fg, bg) {
   if (!fg) { fg = this._options.fg }
   if (!bg) { bg = this._options.bg }
   this._data[x+","+y] = [x, y, ch, fg, bg]

   if (this._dirty === true) { return } /* will already redraw everything */
   if (!this._dirty) { this._dirty = {} } /* first! */
   this._dirty[x+","+y] = true
 }
 drawText(x, y, text, maxWidth) {
   var fg = null;
   var bg = null;
   var cx = x;
   var cy = y;
   var lines = 1;
   if (!maxWidth) { maxWidth = this._options.width-x; }

   var tokens = RTK_ASCII.tokenize(text, maxWidth)

   while (tokens.length) { /* interpret tokenized opcode stream */
     var token = tokens.shift()
     switch (token.type) {
     case RTK_ASCII:
     var isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false
     for (var i=0;i<token.value.length;i++) {
     var cc = token.value.charCodeAt(i)
     var c = token.value.charAt(i)
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
     this.draw(cx++, cy, c, fg, bg)
     isPrevSpace = isSpace
     isPrevFullWidth = isFullWidth
   }
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
 }
 _tick() {
   requestAnimationFrame(this._tick)
   if (!this._dirty) { return }
   if (this._dirty === true) { /* draw all */
     this._context.fillStyle = this._options.bg
     this._context.fillRect(0, 0, this._context.options.width, this._context.options.height)

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
 _drawNoCache(data, clearBefore) {
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
}
