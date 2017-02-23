import Creature from './creature.js';
import {colors} from './spell/fabric.js';

export default class Enemy extends Creature {
  constructor(x, y, spellType) {
    super(x, y, 20, 30, 'black');
    this.enabledSpells = spellType ? [spellType]: [];
    this.movespeed.x = 80;
    this.color = spellType ? colors[this.enabledSpells[0]] : 'black';
  }
}
