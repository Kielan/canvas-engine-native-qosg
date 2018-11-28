class Backend {
  constructor(context) {
    this._context=context
  }
  draw(data,clearBefore){};
  computeSize(availWidth,availHeight){};
}
/*
Backend.prototype.compute=function(options){};
Display.Backend.prototype.
Display.Backend.prototype.
Display.Backend.prototype.computeFontSize=function(availWidth,availHeight){};
Display.Backend.prototype.eventToPosition=function(x,y){};
*/
export { Backend }
