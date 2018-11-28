import { Glyph } from './Glyph';

function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}

class DynamicGlyph extends Glyph {
  constructor(properties) {
    super(properties)
    properties=properties||{};
    this._name=properties["name"]||"";
    this._attachedMixins={};
    this._attachedMixinGroups={};
    this._listeners={};
    var mixins=properties["mixins"]||[];
    for(var i=0;i<mixins.length;i++){for(var key in mixins[i]){
      if(key!="init"&&key!="name"&&key!="listeners"&&!this.hasOwnProperty(key)){this[key]=mixins[i][key]}}
      this._attachedMixins[mixins[i].name]=true;
    if(mixins[i].groupName){this._attachedMixinGroups[mixins[i].groupName]=true}
    if(mixins[i].listeners){
      for(var key in mixins[i].listeners){
        if(!this._listeners[key]){
          this._listeners[key]=[]
        }
        this._listeners[key].push(mixins[i].listeners[key])
      }
      } if(mixins[i].init){
        mixins[i].init.call(this,properties)
      }
    }
  };
    hasMixin(obj){
      if(_typeof(obj)==="object"){
        return this._attachedMixins[obj.name]
      }else{
        return this._attachedMixins[obj]||this._attachedMixinGroups[obj]
      }
    };
    setName(name){this._name=name};
    getName(){return this._name};
    describe(){return this._name};
    describeA(capitalize){
      var prefixes=capitalize?["A","An"]:["a","an"];
      var string=this.describe();
      var firstLetter=string.charAt(0).toLowerCase();
      var prefix="aeiou".indexOf(firstLetter)>=0?1:0;
      return prefixes[prefix]+" "+string
    };
    describeThe(capitalize){
      var prefix=capitalize?"The":"the";return prefix+" "+this.describe()
    };
    raiseEvent(event){
      if(!this._listeners[event]){return}
      var args=Array.prototype.slice.call(arguments,1);
      var results=[];
      for(var i=0;i<this._listeners[event].length;i++){
        results.push(this._listeners[event][i].apply(this,args))
      }
      return results
    };
    details(){
      var details=[];
      var detailGroups=this.raiseEvent("details");
      if(detailGroups){for(var i=0,l=detailGroups.length;i<l;i++){if(detailGroups[i]){for(var j=0;j<detailGroups[i].length;j++){details.push(detailGroups[i][j].key+": "+detailGroups[i][j].value)}}}}return details.join(", ")
    };
}
export { DynamicGlyph }
