import Creature from './creature.js';
import WorldObject from './base.js';
import * as Spells from './spell/fabric.js';

export default class Player extends Creature {
  constructor() {
    const pos = new SAT.Vector(100, 350);
    const model = new SAT.Box(pos, 20, 30);
    super(model, 'white');
    this.enabledSpells = [Spells.TAKE]
  }

  changeSpell() {
    //todo: lodash debounce
    if (this.timeout) return;

    const spells = this.enabledSpells;
    this.enabledSpells = [...spells.slice(1), spells[0]];

    this.timeout = setTimeout(() => {
      this.timeout = null
    }, 200);
  }
}
