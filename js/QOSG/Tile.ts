import { Glyph } from './Glyph';

class Tile extends Glyph {
  constructor(properties) {
    super()
    console.log('what the fuck is happening!!!', properties)
    this._walkable=properties.walkable;
    this._blocksLight=properties["blocksLight"]!==undefined?properties["blocksLight"]:true;
    this._description=properties["description"]||""
  };
  isWalkable(){
    return this._walkable
  };
  isBlockingLight(){
    return this._blocksLight
  };
  nullTile() {
    return new Tile({description:"(unknown)"});
  }
  floorTile() {
    return new Tile({character:".",walkable:true,blocksLight:false,description:"A cave floor"});
  }
  wallTile() {
    return new Tile({character:"#",foreground:"goldenrod",description:"A cave wall"});
  }
  stairsDownTile() {
    return new Tile({character:">",foreground:"white",walkable:true,blocksLight:false,description:"A rock staircase leading downwards"});
  }
}

Tile.floorTile = new Tile({
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'A cave floor',
});
Tile.wallTile = new Tile({
    character: '#',
    walkable: false,
    foreground: 'goldenrod',
    description: 'A cave wall',
    blocksLight: false,
});
export { Tile }
