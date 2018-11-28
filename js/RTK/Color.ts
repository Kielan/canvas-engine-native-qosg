Color={
  _clamp:function _clamp(num){
  if(num<0){return 0}else if(num>255){return 255}else{return num}},
  fromString:function fromString(str){var cached,r;if(str in this._cache){cached=this._cache[str]
    }else{
      if(str.charAt(0)=="#"){
        var values=str.match(/[0-9a-f]/gi).map(function(x){
          return parseInt(x,16)
        });
        if(values.length==3){
          cached=values.map(function(x){return x*17})
        }else{
        for(var i=0;i<3;i++){
          values[i+1]+=16*values[i];values.splice(i,1)}
          cached=values
        }
    }else if(r=str.match(/rgb\(([0-9, ]+)\)/i)){
      cached=r[1].split(/\s*,\s*/).map(function(x){return parseInt(x)})
    }else{
      cached=[0,0,0]
    }
      this._cache[str]=cached
    }
    return cached.slice()
  }
}

export { Color }
