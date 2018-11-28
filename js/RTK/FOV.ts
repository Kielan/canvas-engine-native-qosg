import { DIRS } from './DIRS'

class FOV {
  constructor(lightPassesCallback,options){
    this._lightPasses=lightPassesCallback;
    this._options={topology:8};
    for(var p in options){this._options[p]=options[p]}
  }
  _getCircle(cx,cy,r){
    var result=[];
    var dirs,countFactor,startOffset;
    switch(this._options.topology){
      case 4:
        countFactor=1;
        startOffset=[0,1];
        dirs=[DIRS[8][7],DIRS[8][1],DIRS[8][3],DIRS[8][5]];
        break;
      case 6:dirs=DIRS[6];countFactor=1;startOffset=[-1,1];break;
      case 8:dirs=DIRS[4];countFactor=2;startOffset=[-1,1];break;
    }
    var x=cx+startOffset[0]*r;
    var y=cy+startOffset[1]*r;
    for(var i=0;i<dirs.length;i++){
      for(var j=0;j<r*countFactor;j++){
        result.push([x,y]);
        x+=dirs[i][0];
        y+=dirs[i][1]
      }
    }
    return result
  };
};

class DiscreteShadowcasting extends FOV {
  compute(x,y,R,callback){
    /* analyze surrounding cells in concentric rings, starting from the center */
    var map=this._map;
    callback(x,y,0,1);
    if(!this._lightPasses(x,y)){return}
    var DATA=[];
    var A,B,cx,cy,blocks;
    for(var r=1;r<=R;r++){
      var neighbors=this._getCircle(x,y,r);
      var angle=360/neighbors.length;
      for(var i=0;i<neighbors.length;i++){
        cx=neighbors[i][0];
        cy=neighbors[i][1];
        A=angle*(i-0.5);
        B=A+angle;
        blocks=!this._lightPasses(cx,cy);
        if(this._visibleCoords(Math.floor(A),Math.ceil(B),blocks,DATA)){callback(cx,cy,r,1)}
        if(DATA.length==2&&DATA[0]==0&&DATA[1]==360){return}
      }
    }
  };
  _visibleCoords(A,B,blocks,DATA){
    if(A<0){
      var v1=this._visibleCoords(0,B,blocks,DATA);var v2=this._visibleCoords(360+A,360,blocks,DATA);return v1||v2
    }
    var index=0;
    while(index<DATA.length&&DATA[index]<A){index++}
    if(index==DATA.length){if(blocks){DATA.push(A,B)}
    return true}
    var count=0;
    if(index%2){
      while(index<DATA.length&&DATA[index]<B){index++;count++}
        if(count==0){return false
      }
      if(blocks){
        if(count%2){
          DATA.splice(index-count,count,B)
        }else{
          DATA.splice(index-count,count)
        }
      }
      return true
    }else{
      while(index<DATA.length&&DATA[index]<B){index++;count++}
      if(A==DATA[index-count]&&count==1){return false}
      if(blocks){
        if(count%2){
          DATA.splice(index-count,count,A)
        }
        else{
          DATA.splice(index-count,count,A,B)
        }
      }
      return true
    }
  };
}

export { FOV, DiscreteShadowcasting };
