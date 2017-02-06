import Creature from './creature.js';
import WorldObject from './base.js';
import SAT from 'sat';
import * as Spells from './spell.js';

export default class Player extends Creature {
  constructor() {
    const pos = new SAT.Vector(100, 350);
    const model = new SAT.Box(pos, 20, 30);
    super(model, 'white');
    this.enabledSpells = [Spells.TAKE]
  }
}
