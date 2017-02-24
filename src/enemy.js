import Creature from './creature.js';
import {colors} from './spell/fabric.js';

export default class Enemy extends Creature {
  constructor(pos, spellType) {
    const model = new SAT.Box(pos, 20, 30);
    super(model, 'black');
    this.enabledSpells = spellType ? [spellType]: [];
    this.movespeed.x = 80;
    this.color = spellType ? colors[this.enabledSpells[0]] : 'black';
  }
}
