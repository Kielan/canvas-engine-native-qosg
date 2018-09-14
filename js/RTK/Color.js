'use strict'

export const Color = {
  fromString: function(str) {
    var cached, r;
    if (str in this._cache) {
      cached = this._cache[str];
    } else {
      if (str.charAt(0) == "#") { /* hex rgb */

        var values = str.match(/[0-9a-f]/gi).map(function(x) { return parseInt(x, 16); })
        if (values.length == 3) {
          cached = values.map(function(x) { return x*17; })
        } else {
          for (var i=0;i<3;i++) {
            values[i+1] += 16*values[i]
            values.splice(i, 1)
          }
          cached = values
        }
      } else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { /* decimal rgb */
        cached = r[1].split(/\s*,\s*/).map(function(x) { return parseInt(x); })
      } else { /* html name */
        cached = [0, 0, 0]
      }

      this._cache[str] = cached
    }

    return cached.slice()
  }
  add: function(color1, color2) {
    var result = color1.slice()
    for (var i=0;i<3;i++) {
      for (var j=1;j<arguments.length;j++) {
        result[i] += arguments[j][i]
      }
    }
    return result
  }
  multiply: function(color1, color2) {
    var result = color1.slice()
    for (var i=0;i<3;i++) {
      for (var j=1;j<arguments.length;j++) {
        result[i] *= arguments[j][i] / 255
      }
      result[i] = Math.round(result[i])
    }
    return result
  }
  multiply_: function(color1, color2) {
    for (var i=0;i<3;i++) {
    for (var j=1;j<arguments.length;j++) {
      color1[i] *= arguments[j][i] / 255
      }
      color1[i] = Math.round(color1[i])
    }
    return color1
  }
  interpolate: function(color1, color2, factor) {
    if (arguments.length < 3) { factor = 0.5 }
    var result = color1.slice()
    for (var i=0;i<3;i++) {
      result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]))
    }
    return result
  }
  toRGB: function(color) {
    return "rgb(" + this._clamp(color[0]) + "," + this._clamp(color[1]) + "," + this._clamp(color[2]) + ")"
  }
  toHex: function(color) {
    var parts = []
    for (var i=0;i<3;i++) {
      parts.push(this._clamp(color[i]).toString(16).lpad("0", 2))
    }
    return "#" + parts.join("")
  }
  _clamp: function(num) {
    if (num < 0) {
      return 0
    } else if (num > 255) {
      return 255
    } else {
      return num
    }
  }
}
