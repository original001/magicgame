import Creature from './creature.js';

export default class Enemy extends Creature {
  constructor(x, y, spellType) {
    super(x, y, 20, 30, 'black');
    this.enabledSpells = [spellType];
    this.movespeed.x = 100;
  }
}

export class MagicEnemy extends Enemy {
  color = 'blue';
}
