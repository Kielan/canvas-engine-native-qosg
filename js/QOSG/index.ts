import { RTK } from '../RTK';
import { Builder } from './Builder';
import { Entity } from './Entity';
import { Screen } from './screens';
import { Map } from './Map';
import { EntityMixins } from './mixins';

var QOSG = {
  Builder: Builder,
  Entity: Entity,
  Screen: Screen,
  Map: Map,
  EntityMixins: EntityMixins,
  _display:null,
  _currentScreen:null,
  _screenWidth:400,
  _screenHeight:700,
  init:function init(refName){
    this._display=new RTK.Display({width:this._screenWidth,height:this._screenHeight,refName:refName});
    return this
  },
  refresh:function refresh(){
    this._display.clear();
    this._currentScreen.render(this._display);
  },
  switchScreen:function switchScreen(screen){
    if(this._currentScreen!==null){this._currentScreen.exit()}
    //this.getDisplay().clear();
    this._currentScreen=screen;
    if(this._currentScreen!==null){
      this._currentScreen.enter();
      this.refresh()
    }
  },
}

export { QOSG }
