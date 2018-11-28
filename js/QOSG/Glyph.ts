class Glyph {
  constructor(properties){
    properties=properties||{};
    this._char=properties["character"]||" ";
    this._foreground=properties["foreground"]||"white";
    this._background=properties["background"]||"black"
  }
  getChar(){return this._char};
  getBackground(){return this._background};
  getForeground(){return this._foreground};
  getRepresentation(){
    return"%c{"+this._foreground+"}%b{"+this._background+"}"+this._char+"%c{white}%b{black}"
  };
};

export { Glyph }
