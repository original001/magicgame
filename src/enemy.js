import GravityObject from './gravity.js';

export default class Enemy extends GravityObject {
  constructor(x, y) {
    super(x, y, 20, 50, 'black');
  }
  dead() {
    this.pos.x = -100000
  }
}
