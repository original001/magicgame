import GravityObject from './gravity.js';
import WorldObject from './base.js';
import * as Spells from './spell.js';

export default class Player extends GravityObject {
  enabledSpells = [];
  constructor() {
    super(100, 350, 20, 30, 'white');
  }
  move(dir) {
    switch (dir) {
      case 'forward':
        this.right(5.1);
        break;
      case 'back':
        this.left(5.1);
        break;
      case 'up':
        this.jump(300);
        break;
    }
  }
  dead() {
    this.pos.x = -100000
  }
}
