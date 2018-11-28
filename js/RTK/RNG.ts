const RNG={
  getSeed:function getSeed(){return this._seed},
  setSeed:function setSeed(seed){
    seed=seed<1?1/seed:seed;this._seed=seed;this._s0=(seed>>>0)*this._frac;
    seed=seed*69069+1>>>0;this._s1=seed*this._frac;seed=seed*69069+1>>>0;
    this._s2=seed*this._frac;this._c=1;return this
  },
  getUniform:function getUniform(){
    var t=2091639*this._s0+this._c*this._frac;this._s0=this._s1;
    this._s1=this._s2;this._c=t|0;
    this._s2=t-this._c;
    return this._s2
  },
  getUniformInt:function getUniformInt(lowerBound,upperBound){
    var max=Math.max(lowerBound,upperBound);
    var min=Math.min(lowerBound,upperBound);
    return Math.floor(this.getUniform()*(max-min+1))+min
  },
  getNormal:function getNormal(mean,stddev){
    do {var u=2*this.getUniform()-1;
      var v=2*this.getUniform()-1;
      var r=u*u+v*v
    } while(r>1||r==0);
    var gauss=u*Math.sqrt(-2*Math.log(r)/r);
    return(mean||0)+gauss*(stddev||1)
  },
  getPercentage:function getPercentage(){return 1+Math.floor(this.getUniform()*100)},
  getWeightedValue:function getWeightedValue(data){var total=0;for(var id in data){total+=data[id]}var random=this.getUniform()*total;var part=0;for(var id in data){part+=data[id];if(random<part){return id}}return id},
  getState:function getState(){return[this._s0,this._s1,this._s2,this._c]},
  setState:function setState(state){this._s0=state[0];this._s1=state[1];this._s2=state[2];this._c=state[3];return this},
  clone:function clone(){var clone=Object.create(this);clone.setState(this.getState());return clone},
  _s0:0,_s1:0,
  _s2:0,_c:0,
  _frac:2.3283064365386963e-10
};
RNG.setSeed(Date.now());

export { RNG }
