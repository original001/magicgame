import GravityObject from './gravity.js';

export default class Enemy extends GravityObject {
  constructor(x, y) {
    super(x, y, 20, 30, 'black');
  }
  dead() {
    this.pos.x = -100000
  }
}

export class MagicEnemy extends Enemy {
  enabledSpells = [];
  color = 'blue';

  constructor(x, y, spellType) {
    super(x, y);
    this.enabledSpells = [spellType];
  }
}
