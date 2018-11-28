import { Entity } from '../Entity';
import { PlayerTemplate } from '../templates';
import { Builder } from '../Builder';
import { Cave } from '../Map';

const PlayScreen={
    _player:null,
    _gameEnded:false,
    _subScreen:null,
    enter:function enter(){
      //full tile value of map
      var width=150;
      var height=200;
      var depth=6;
      this._player=new Entity(PlayerTemplate);
      var tiles=new Builder(width,height,depth).getTiles();
      var map=new Cave(tiles,this._player);
      //console.log('PlayScreen.tiles issue', tiles)
      map.getEngine().start();
    },
    exit:function exit(){console.log("Exited play screen.")},
    render:function render(display){
      this.renderTiles(display)
    },
    getScreenOffsets:function getScreenOffsets(){
//      var topLeftX=Math.max(0,this._player.getX()-QOSG.getScreenWidth()/3);
//      var topLeftX2=Math.min(topLeftX,this._player.getMap().getWidth()-QOSG.getScreenWidth());
//      var topLeftY=Math.max(0,this._player.getY()-QOSG.getScreenHeight()/2);
//      var topLeftY2=Math.min(topLeftY,this._player.getMap().getHeight()-QOSG.getScreenHeight());
      console.log('._playerxy', this._player.getX(), this._player.getY());
      return{x:0,y:0}
    },
    renderTiles:function renderTiles(display){
      var screenWidth=400;
      var screenHeight=700;
      var offsets=this.getScreenOffsets();
    //  var topLeftX=0//offsets.x;
    //  var topLeftY=0//offsets.y;
      var topLeftX=this._player.getX() - 6
      var topLeftY=this._player.getY() - 10


      /*
      This section needs to be changed, draw must take an arg other than topLeftX,
      thtat is the offset of the player
      */
      //THE BUG IS AROUND MAYBE ABOVE HERE
      var map=this._player.getMap();
      var currentDepth=this._player.getZ();
      var visibleCells = {};


//      console.log('kielan rendertiles', this._player.getSightRadius())

      map.getFov(currentDepth).compute(this._player.getX(),this._player.getY(),this._player.getSightRadius(),function(x,y,radius,visibility){
        visibleCells[x+","+y]=true;
        map.setExplored(x,y,currentDepth,true)
      });


      //yeah the algorithm right HERE
      /*
        the x topLeftX y and topLeftY values are
        where on the data map are the points being
        traversed, the screenCanvasYInternals is
        the screen coordinated that display
        will potentially draw
      */
      var screenCanvasXInternal = 0;
      var screenCanvasYInternal = 0;

      for(var x=topLeftX;x<topLeftX+12;x++){
        for(var y=topLeftY;y<topLeftY+20;y++){
          if(map.isExplored(x,y,currentDepth)){
            var glyph=map.getTile(x,y,currentDepth);
            var foreground=glyph.getForeground();
            if(visibleCells[x+","+y]){
              if(map.getEntityAt(x,y,currentDepth)){
                glyph=map.getEntityAt(x,y,currentDepth)
              }
              foreground=glyph.getForeground()
            }else{
              foreground="darkGray"
            }
            display.draw(x,y,glyph.getChar(),foreground,glyph.getBackground())
          } else {
            console.log('mapfov not working')
          }
        }
      }
    }

      //get player location and..
/*
      for(var x=topLeftX;x<12;x++){
        for(var y=topLeftY;y<20;y++){
          if (x <= 6) {
            var glyph = map.getTile((this._player.getX() - x), (this._player.getY() - y), currentDepth);
          }
          if (x > 6) {
            var glyph = map.getTile((this._player.getX() + (x - (x-1))), (this._player.getY() + y), currentDepth);
          }
          if (y <= 10) {
            var glyph = map.getTile((this._player.getX() - x), (this._player.getY() - y), currentDepth);
          }
          if (y > 10) {
            var glyph = map.getTile((this._player.getX() - x), (this._player.getY() - y), currentDepth);
          }
          if(map.isExplored(x,y,currentDepth)){
            console.log('rendertiles isExplored :)', x, y)
            var glyph=map.getTile((this._player.getX() - x/2),y,currentDepth);
            var foreground=glyph.getForeground();

            if(visibleCells[x+","+y]){
              if(map.getEntityAt(x,y,currentDepth)){
              glyph=map.getEntityAt(x,y,currentDepth)}foreground=glyph.getForeground()
            }else{
              foreground="darkGray"
            }

            display.draw(x,y,glyph.getChar(),foreground,glyph.getBackground())
          }
        }
      }

    }*/
};
export { PlayScreen }
