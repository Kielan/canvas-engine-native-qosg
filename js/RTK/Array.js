Array.prototype.random = Array.prototype.random || function() {
	if (!this.length) { return null; }
	return this[Math.floor(ROT.RNG.getUniform() * this.length)];
};

/**
 * @returns {array} New array with randomized items
 */
Array.prototype.randomize = Array.prototype.randomize || function() {
  var result = [];
  var clone = this.slice();
  while (clone.length) {
    var index = clone.indexOf(clone.random());
    result.push(clone.splice(index, 1)[0]);
  }
  return result;
}
