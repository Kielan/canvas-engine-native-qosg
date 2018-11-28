import { RTK } from '../RTK'
import { Tile } from './Tile'

var Builder=function(width,height,depth){
  this._width=width;
  this._height=height;
  this._depth=depth;
  this._tiles=new Array(depth);
  this._regions=new Array(depth);
  for(var z=0;z<depth;z++){
    this._tiles[z]=this._generateLevel()
  }
};
Builder.prototype.getTiles=function(){return this._tiles};
Builder.prototype.getDepth=function(){return this._depth};
Builder.prototype.getWidth=function(){return this._width};
Builder.prototype.getHeight=function(){return this._height};
Builder.prototype._generateLevel=function(){
  console.log('Builder.prototype._generateLevel')
  var map=new Array(this._width);
  for(var w=0;w<this._width;w++){
    map[w]=new Array(this._height)
  }
  var generator=new RTK.Cellular(this._width,this._height);
  generator.randomize(0.5);
  var totalIterations=3;
  for(var i=0;i<totalIterations-1;i++){
    generator.create()
  }
  generator.create(function(x,y,v){
    if(v===1){
      map[x][y]= Tile.floorTile
    }else{
      map[x][y]= Tile.wallTile
    }
  });
//  console.log('well something happened', map);
  return map
};
Builder.prototype._canFillRegion=function(x,y,z){if(x<0||y<0||z<0||x>=this._width||y>=this._height||z>=this._depth){return false}if(this._regions[z][x][y]!=0){return false}return this._tiles[z][x][y].isWalkable()};
Builder.prototype._fillRegion=function(region,x,y,z){
  var tilesFilled=1;
  var tiles=[{x:x,y:y}];
  var tile;
  var neighbors;
  this._regions[z][x][y]=region;
  while(tiles.length>0){
  tile=tiles.pop();
  neighbors=this.getNeighborPositions(tile.x,tile.y);
  while(neighbors.length>0){
    tile=neighbors.pop();
    if(this._canFillRegion(tile.x,tile.y,z)){
      this._regions[z][tile.x][tile.y]=region;
      tiles.push(tile);tilesFilled++}}
    }return tilesFilled
};
Builder.prototype.getNeighborPositions=function(x,y){
  var tiles=[];
  for(var dX=-10;dX<2;dX++){
    for(var dY=-10;dY<2;dY++){
      if(dX==0&&dY==0){continue}
      tiles.push({x:x+dX,y:y+dY})
    }
  }
  return tiles.randomize()
};
Builder.prototype._removeRegion=function(region,z){
  for(var x=0;x<this._width;x++){
    for(var y=0;y<this._height;y++){
      if(this._regions[z][x][y]==region){
        this._regions[z][x][y]=0;
        this._tiles[z][x][y]=Tile.wallTile
      }
    }
  }
};
Builder.prototype._setupRegions=function(z){var region=1;var tilesFilled;for(var x=0;x<this._width;x++){for(var y=0;y<this._height;y++){if(this._canFillRegion(x,y,z)){tilesFilled=this._fillRegion(region,x,y,z);if(tilesFilled<=20){this._removeRegion(region,z)}else{region++}}}}};
Builder.prototype._findRegionOverlaps=function(z,r1,r2){
  var matches=[];
  for(var x=0;x<this._width;x++){
    for(var y=0;y<this._height;y++){
      if(this._tiles[z][x][y]==Tile.floorTile&&this._tiles[z+1][x][y]==Tile.floorTile&&this._regions[z][x][y]==r1&&this._regions[z+1][x][y]==r2){
        matches.push({x:x,y:y})
      }
    }
  }
    return matches.randomize()
};
Builder.prototype._connectRegions=function(z,r1,r2){
  var overlap=this._findRegionOverlaps(z,r1,r2);
  if(overlap.length==0){return false}
  var point=overlap[0];
  this._tiles[z][point.x][point.y]=Tile.stairsDownTile;
  this._tiles[z+1][point.x][point.y]=Tile.stairsUpTile;
  return true};
Builder.prototype._connectAllRegions=function(){
  for(var z=0;z<this._depth-1;z++){
    var connected={};var key;
    for(var x=0;x<this._width;x++){
      for(var y=0;y<this._height;y++){
        key=this._regions[z][x][y]+","+this._regions[z+1][x][y];
        if(this._tiles[z][x][y]==Tile.floorTile&&this._tiles[z+1][x][y]==Tile.floorTile&&!connected[key]){
          this._connectRegions(z,this._regions[z][x][y],this._regions[z+1][x][y]);
          connected[key]=true
        }
      }
    }
  }
};

export { Builder }
