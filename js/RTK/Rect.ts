class Rect {
  constructor(context) {
    /*
    my architecture verison
    */
    this._context=context

    //
    this.cache=false
    this._spacingX=3;
    this._spacingY=3;
    this._canvasCache={};
    this._options={}
  }
  compute(options){
    console.log('RTK.Display.Rect.prototype.compute arg options', options.height)
    this._canvasCache={};
    this._options=options;
    var charWidth=1;
    this._spacingX= Math.ceil(options.spacing*charWidth);//10;
    this._spacingY=Math.ceil(options.spacing*options.fontSize);
    if(this._options.forceSquareRatio){
      this._spacingX=this._spacingY=Math.max(this._spacingX,this._spacingY)
    }
    var contextWidthInternal = options.width*this._spacingX;
    var contextHeightInternal = options.height*this._spacingY;
    this._context.width = contextWidthInternal;
    this._context.height = contextHeightInternal;
  }
  draw(data,clearBefore){
    console.log('Rect.draw called')
    //  if(this.constructor.cache){this._drawWithCache(data,clearBefore)}else{this._drawNoCache(data,clearBefore)}
    this._drawNoCache(data,clearBefore)
  };
  _drawNoCache(data,clearBefore){
    var x=data[0];var y=data[1];var ch=data[2];var fg=data[3];var bg=data[4];
    if(clearBefore){
      console.log('Rect._drawNoCache called')
      var b=this._options.border;
      this._context.fillStyle = 'green'
      this._context.fillRect(0, 0, 100, 100)
//      this._context.fillStyle=bg;
//      this._context.fillRect(x*this._spacingX,y*this._spacingY,this._spacingX-b,this._spacingY-b)
    }
    if(!ch){return}
    this._context.fillStyle=fg;var chars=[].concat(ch);
    for(var i=0;i<chars.length;i++){
      var ceilX = Math.ceil((x+0.5)*this._spacingX)
      var ceilY = Math.ceil((y+0.5)*this._spacingY)

      var notCeilX = Math.ceil(x+(i*this._spacingX));
      var notCeilY = Math.ceil(y+(i*this._spacingY));

      console.log('qosgcontrol drawnocache', notCeilX, notCeilY, this._spacingX, this._spacingY)
      this._context.fillText(chars[i],x, y)
//      this._context.fillText(chars[i],Math.ceil((x+0.5)*this._spacingX),Math.ceil((y+0.5)*this._spacingY))
    }
  };
};

export { Rect }
