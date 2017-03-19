import Creature from './creature.js';
import WorldObject from './base.js';
import * as Spells from './spell/fabric.js';

export default class Player extends Creature {
  textureIdsLeft= [145, 146]
  textureIdsRight = [161, 162]
  textureIdRight = 160
  textureIdLeft = 144
  enabledSpells = [Spells.TAKE]

  constructor(model) {
    super(model, 'white');
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
