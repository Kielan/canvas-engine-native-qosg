export class Player {
  constructor(x, y) {
    super(x, y)
    this._x = x
    this._y = y
  }
  _draw() {
    Game.display.draw(this._x, this._y, "@", "#ff0")
  }
}
