import Creature from './creature';
import WorldObject from './base';
import {SpellType} from './spell/fabric';

export default class Player extends Creature {
  textureIdsLeft = [145, 146]
  textureIdsRight = [161, 162]
  textureIdRight = 160
  textureIdLeft = 144
  enabledSpells = [SpellType.BOLT]
  private timeout: number;

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
