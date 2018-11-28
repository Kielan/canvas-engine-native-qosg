import { DIRS } from '../DIRS';
import { RNG } from '../RNG';
import { Map } from  './Map';

class Cellular extends Map {
  constructor(width,height,options) {
    super(width,height)
    this._options={
      born:[5,6,7,8],
      survive:[4,5,6,7,8],
      topology:8
    };
    this.setOptions(options);
    this._dirs=DIRS[this._options.topology];
    this._map=this._fillMap(0);
  }
  randomize(probability){
    for(var i=0;i<this._width;i++){
      for(var j=0;j<this._height;j++){
        this._map[i][j]=RNG.getUniform()<probability?1:0
      }
    }
    return this
  };
  setOptions(options){
    for(var p in options){
      this._options[p]=options[p]
    }
  //  console.log('kielan Map.Cellular.setOptions', this._options)
  };
  set(x,y,value){this._map[x][y]=value};
  create(callback){
    //initially the entire dataset is filled with 0's
    var newMap=super._fillMap(0);
  //  console.log('RTK.Map.Cellular create newmap', newMap);
    var born=this._options.born;
    var survive=this._options.survive;
    for(var j=0;j<this._height;j++){
      var widthStep=1;
      var widthStart=0;
      if(this._options.topology==6){widthStep=2;widthStart=j%2}
      for(var i=widthStart;i<this._width;i+=widthStep){
        var cur=this._map[i][j];
        var ncount=this._getNeighbors(i,j);
        if(cur&&survive.indexOf(ncount)!=-1){
          newMap[i][j]=1
        }else if(!cur&&born.indexOf(ncount)!=-1){
          newMap[i][j]=1
        }
      }
    }
  //  console.log('RTK.Map.Cellular.createx2', newMap);
    //1's are added to tiles in newMap set
    //that are marked visible in
    //this draw stage
    this._map=newMap;
    callback&&this._serviceCallback(callback)
  };
  _serviceCallback(callback){
    for(var j=0;j<this._height;j++){
      var widthStep=1;var widthStart=0;
      if(this._options.topology==6){widthStep=2;widthStart=j%2}
      for(var i=widthStart;i<this._width;i+=widthStep){
      //  console.log('RTK.Map.Cellular._serviceCallback')
        callback(i,j,this._map[i][j])
      }
    }
  };
  _getNeighbors(cx,cy){
    var result=0;
    for(var i=0;i<this._dirs.length;i++){
      var dir=this._dirs[i];var x=cx+dir[0];
      var y=cy+dir[1];if(x<0||x>=this._width||y<0||y>=this._height){continue}result+=this._map[x][y]==1?1:0}
      return result
  };
  _getClosest(point,space){
    var minPoint=null;var minDist=null;for(k in space){var p=space[k];
    var d=(p[0]-point[0])*(p[0]-point[0])+(p[1]-point[1])*(p[1]-point[1]);
    if(minDist==null||d<minDist){minDist=d;minPoint=p}}
    return minPoint
  };
  _findConnected(connected,notConnected,stack,keepNotConnected,value){
    while(stack.length>0){
      var p=stack.splice(0,1)[0];
      var tests;
      if(this._options.topology==6){
        tests=[[p[0]+2,p[1]],[p[0]+1,p[1]-1],[p[0]-1,p[1]-1],[p[0]-2,p[1]],[p[0]-1,p[1]+1],[p[0]+1,p[1]+1]]
      }else{
        tests=[[p[0]+1,p[1]],[p[0]-1,p[1]],[p[0],p[1]+1],[p[0],p[1]-1]]
      }for(var i=0;i<tests.length;i++){
        var key=this._pointKey(tests[i]);if(connected[key]==null&&this._freeSpace(tests[i][0],tests[i][1],value)){
          connected[key]=tests[i];
          if(!keepNotConnected){delete notConnected[key]}stack.push(tests[i])
        }
      }
    }
  };
  _tunnelToConnected(to,from,connected,notConnected,value,connectionCallback){
    var key=this._pointKey(from);var a,b;if(from[0]<to[0]){a=from;b=to}else{a=to;b=from}
    for(var xx=a[0];xx<=b[0];xx++){
      this._map[xx][a[1]]=value;var p=[xx,a[1]];
      var pkey=this._pointKey(p);connected[pkey]=p;
      delete notConnected[pkey]
    }
    if(connectionCallback&&a[0]<b[0]){connectionCallback(a,[b[0],a[1]])}
    var x=b[0];
    if (from[1]<to[1]){
      a=from;
      b=to
    }else{
      a=to;
      b=from
    }
    for(var yy=a[1];yy<b[1];yy++){
      this._map[x][yy]=value;
      var p=[x,yy];
      var pkey=this._pointKey(p);
      connected[pkey]=p;
      delete notConnected[pkey]
    } if(connectionCallback&&a[1]<b[1]){
      connectionCallback([b[0],a[1]],[b[0],b[1]])
    }
  };
  _freeSpace(x,y,value){
    return x>=0&&x<this._width&&y>=0&&y<this._height&&this._map[x][y]==value
  };
  _pointKey(p){
    return p[0]+"."+p[1];
  };
  connect(callback,value,connectionCallback){
    if(!value)value=0;
    var allFreeSpace=[];
    var notConnected={};
    var widthStep=1;
    var widthStarts=[0,0];
    if(this._options.topology==6){widthStep=2;widthStarts=[0,1]}
    for(var y=0;y<this._height;y++){
      for(var x=widthStarts[y%2];x<this._width;x+=widthStep){
        if(this._freeSpace(x,y,value)){
          var p=[x,y];notConnected[this._pointKey(p)]=p;
          allFreeSpace.push([x,y])
        }
        }
      }
      var start=allFreeSpace[RNG.getUniformInt(0,allFreeSpace.length-1)];
      var key=this._pointKey(start);
      var connected={};connected[key]=start;
      delete notConnected[key];this._findConnected(connected,notConnected,[start],false,value);
      while(Object.keys(notConnected).length>0){
        var p=this._getFromTo(connected,notConnected);
        var from=p[0];var to=p[1];var local={};
        local[this._pointKey(from)]=from;
        this._findConnected(local,notConnected,[from],true,value);
        var tunnelFn=this._options.topology==6?this._tunnelToConnected6:this._tunnelToConnected;
        tunnelFn.call(this,to,from,connected,notConnected,value,connectionCallback);
        for(var k in local){
          var pp=local[k];
          this._map[pp[0]][pp[1]]=value;connected[k]=pp;delete notConnected[k]}
        }
          callback&&this._serviceCallback(callback)
  };
  _getFromTo(connected,notConnected){
    var from,to,d;var connectedKeys=Object.keys(connected);
    var notConnectedKeys=Object.keys(notConnected);for(var i=0;i<5;i++){
      if(connectedKeys.length<notConnectedKeys.length) {
        var keys=connectedKeys;
        to=connected[keys[RNG.getUniformInt(0,keys.length-1)]];
        from=this._getClosest(to,notConnected)
      } else {
        var keys=notConnectedKeys;
        from=notConnected[keys[RNG.getUniformInt(0,keys.length-1)]];
        to=this._getClosest(from,connected)}
        d=(from[0]-to[0])*(from[0]-to[0])+(from[1]-to[1])*(from[1]-to[1]);
        if(d<64){break}
      }
      return[from,to]
    };
};

export { Cellular }
