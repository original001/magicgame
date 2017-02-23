import Creature from './creature.js';
import WorldObject from './base.js';
import * as Spells from './spell/fabric.js';

export default class Player extends Creature {
  constructor() {
    super(100, 350, 20, 30, 'white');
    this.enabledSpells = [Spells.TAKE]
  }

  changeSpell() {
    const spells = this.enabledSpells;
    this.enabledSpells = [...spells.slice(1), spells[0]];
  }
}
