import { Rect } from './Rect';

class Display {
  constructor(options) {
    this._backend=null;
    this._context = options.refName
    this._data={};
    this._dirty=false;
    this._options={};
    this.canvas={
      width:400,
      height:700,
    };
    this.defaultOptions={
      width:400,height:700,
      transpose:false,
      layout:"rect",
      fontSize:15,
      spacing:1,
      border:0,
      forceSquareRatio:false,
      fontFamily:"monospace",
      fontStyle:"",
      fg:"#fff",bg:"#000",
      tileWidth:32,tileHeight:32,
      tileMap:{},
      tileSet:null,
      tileColorize:false,
      termColor:"xterm"
    };
//    this.defaultOptions=_objectSpread({},this.defaultOptions,options);
//    this.setOptions=this.setOptions.bind(this);
    this._tick=this._tick.bind(this);
    this._draw=this._draw.bind(this);

    this.setOptions({...this.defaultOptions, ...options});
    requestAnimationFrame(this._tick)
  }
  clear(){
    this._data={};
    this._dirty=true
  };
  setOptions(options){
    //  console.log('RTK.Display.prototype.setOptions', options)
    for(var p in options){this._options[p]=options[p]};
    if(options.width||options.height||options.fontSize||options.fontFamily||options.spacing||options.layout){if(options.layout){
      this._backend=new Rect(this._context)}
      var font=(this._options.fontStyle?this._options.fontStyle+" ":"")+this._options.fontSize+"px "+this._options.fontFamily;
      this._backend.compute(this._options);
      this._context.font=font;
      this._context.textAlign="center";
      this._context.textBaseline="middle";
      this._dirty=true
    }
    return this
  };
  draw(x,y,ch,fg,bg){
    console.log('smiley draw :)', x, y)
    if(!fg){
      fg=this._options.fg
    }
    if(!bg){bg=this._options.bg}
    this._data[x+","+y]=[x,y,ch,fg,bg];
    if(this._dirty===true){return}
    if(!this._dirty){this._dirty={}}
    this._dirty[x+","+y]=true
  };
  _tick(){
    if(!this._dirty){return}
    if(this._dirty===true){
      this._context.fillStyle=this._options.bg;
      this._context.fillRect(0,0,this.canvas.width,this.canvas.height);
      console.log('Display.prototype._tick this._data', this._data);
      //this._data is empty
  //    this._camera.cropDraw(this._data);
      for(var id in this._data){
        this._draw(id,false)
      }
    }else{
      for(var key in this._dirty){
        this._draw(key,true)
      }
    }
    this._dirty=false
  };
  _draw(key,clearBefore) {
    var data=this._data[key];
    if(data[4]!=this._options.bg){
      clearBefore=true
    };
    console.log('Display.ts _draw')//this._backend
    this._backend.draw(data,clearBefore)
  }
};

export { Display }
