'use strict'
/**
 * @namespace Top-level ROT namespace
 */

  //   ASCII_COLORS
 export class RTK {
   constructor(context) {
     this._context = context
     this._data = {}
     this._dirty = false /* false = nothing, true = all, object = dirty cells */
     this._options = {}
     /* Directional constants. Ordering is important! */
     this.DIRS = {
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
     }
   }

 }
 export class RTK_ASCII extends RTK {
   constructor(props) {
     /* token types */
     this.TYPE_TEXT =	0
	   this.TYPE_NEWLINE = 1
  	 this.TYPE_FG = 2
     this.TYPE_MG2 = 3
     this.TYPE_MG1 = 4
     this.TYPE_BG =	5
 }

  measure(str, maxWidth) {
    var result = {width:0, height:1}
    var tokens = this.tokenize(str, maxWidth)
    var lineWidth = 0

    for (var i=0;i<tokens.length;i++) {
      var token = tokens[i]
      switch (token.type) {
        case this.TYPE_TEXT:
          lineWidth += token.value.length;
        break;
        case this.TYPE_NEWLINE:
          result.height++
          result.width = Math.max(result.width, lineWidth)
          lineWidth = 0
        break;
      }
    }
    result.width = Math.max(result.width, lineWidth)
    return result
  }
   tokenize(str, maxWidth) {
   var result = [];

   /* first tokenization pass - split texts and color formatting commands */
   var offset = 0;
   str.replace(this.ASCII_COLORS, function(match, type, name, index) {
     /* string before */
     var part = str.substring(offset, index)
     if (part.length) {
       result.push({
         type: RTK_ASCII.TYPE_TEXT,
         value: part
       })
     }

     /* color command */
     result.push({
       type: (type == "c" ? RTK_ASCII.TYPE_FG : RTK_ASCII.TYPE_BG),
       value: name.trim()
     })
     offset = index + match.length
     return ""
   })

   /* last remaining part */
   var part = str.substring(offset)
   if (part.length) {
     result.push({
       type: RTK_ASCII.TYPE_TEXT,
       value: part
      })
   }

   return this._breakLines(result, maxWidth)
 }
  _breakLines(tokens, maxWidth) {
    if (!maxWidth) { console.log('err no maxWidth applied') }

    var i = 0;
    var lineLength = 0;
    var lastTokenWithSpace = -1;

    while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
      var token = tokens[i];
      if (token.type == RTK_ASCII.TYPE_NEWLINE) { /* reset */
        lineLength = 0;
        lastTokenWithSpace = -1;
      }
      if (token.type != RTK_ASCII.TYPE_TEXT) { /* skip non-text tokens */
        i++;
        continue;
      }

      /* remove spaces at the beginning of line */
      while (lineLength == 0 && token.value.charAt(0) == " ") { token.value = token.value.substring(1) }

      /* forced newline? insert two new tokens after this one */
      var index = token.value.indexOf("\n")
      if (index != -1) {
        token.value = this._breakInsideToken(tokens, i, index, true)

        /* if there are spaces at the end, we must remove them (we do not want the line too long) */
        var arr = token.value.split("")
        while (arr.length && arr[arr.length-1] == " ") { arr.pop() }
          token.value = arr.join("")
        }

        /* token degenerated? */
        if (!token.value.length) {
          tokens.splice(i, 1)
          continue;
        }

        if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */

          /* is it possible to break within this token? */
          var index = -1;
          while (1) {
            var nextIndex = token.value.indexOf(" ", index+1)
            if (nextIndex == -1) { break; }
            if (lineLength + nextIndex > maxWidth) { break; }
              index = nextIndex
            }

            if (index != -1) { /* break at space within this one */
              token.value = this._breakInsideToken(tokens, i, index, true);
            } else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
              var token = tokens[lastTokenWithSpace];
              var breakIndex = token.value.lastIndexOf(" ")
              token.value = this._breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true)
              i = lastTokenWithSpace
            } else { /* force break in this token */
              token.value = this._breakInsideToken(tokens, i, maxWidth-lineLength, false);
            }

          } else { /* line not long, continue */
            lineLength += token.value.length;
            if (token.value.indexOf(" ") != -1) { lastTokenWithSpace = i; }
          }

          i++; /* advance to next token */
        }

        tokens.push({type: RTK_ASCII.TYPE_NEWLINE}); /* insert fake newline to fix the last text line */

      /* remove trailing space from text tokens before newlines */
      var lastTextToken = null;
      for (var i=0;i<tokens.length;i++) {
      var token = tokens[i];
      switch (token.type) {
      case RTK_ASCII.TYPE_TEXT: lastTextToken = token; break;
      case RTK_ASCII.TYPE_NEWLINE:
      if (lastTextToken) { /* remove trailing space */
      var arr = lastTextToken.value.split("");
      while (arr.length && arr[arr.length-1] == " ") { arr.pop(); }
      lastTextToken.value = arr.join("");
      }
      lastTextToken = null;
      break;
      }
    }

    tokens.pop(); /* remove fake token */

    return tokens;
  }
    /**
     * Create new tokens and insert them into the stream
     * @param {object[]} tokens
     * @param {int} tokenIndex Token being processed
     * @param {int} breakIndex Index within current token's value
     * @param {bool} removeBreakChar Do we want to remove the breaking character?
     * @returns {string} remaining unbroken token value
     */
    _breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
      var newBreakToken = {
        type: RTK_ASCII.TYPE_NEWLINE
      };
      var newTextToken = {
        type: RTK_ASCII.TYPE_TEXT,
        value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
      };
      tokens.splice(tokenIndex+1, 0, newBreakToken, newTextToken)
      return tokens[tokenIndex].value.substring(0, breakIndex)
    }
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
 export class Display extends RTK {
   constructor(options) {
     super(options)
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
