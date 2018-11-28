import { Map } from './Map';

class Cave extends Map {
  constructor(tiles, player) {
    super(tiles)
    super.addEntityAtRandomPosition(player,0);
  }
}
export { Cave }
