import {Spell} from './spell';
import SAT from 'sat';
import Creature from '../creature';
import WorldObject from '../base';

export default class TakeSpell extends WorldObject implements Spell {
  speed: SAT.Vector;
  source: Creature;
  constructor(source: Creature) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
    const model = new SAT.Box(pos, 10, 10);
    super(model, 'gray');
    this.speed = new SAT.Vector(400 * source.direction, 0);
    this.source = source;
    this.init();
  }

  init() {
    setTimeout(() => {
      this.remove()
    }, 150);
  }

  collide(target) {
    const source = this.source;
    if (target === source) return;
    if (target.enabledSpells && source.enabledSpells && source.enabledSpells.indexOf(target.enabledSpells) === -1) {
      source.enabledSpells = target.enabledSpells.concat(source.enabledSpells);
      target.enabledSpells.splice(0, 1);
    }
    this.remove();
  }
}
