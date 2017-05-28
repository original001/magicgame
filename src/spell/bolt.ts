import {Spell} from './spell';
import Creature from './../creature';
import SAT from 'sat';
import WorldObject, {MovementMode} from './../base';

export default class BoltSpell extends WorldObject implements Spell {
  speed: SAT.Vector;
  source: Creature;
  constructor(source) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
    const model = new SAT.Box(pos, 5, 5);
    super(model, 'blue');
    this.speed = new SAT.Vector(400 * source.direction, 0);
    this.source = source;
    this.init();
    this.movementMode = MovementMode.Linear;
  }
  init() {
    setTimeout(() => {
      this.remove();
    }, 1000);
  }
  /* ovveride */
  collide(target) {
    if (target === this.source) return;

    if (target instanceof Creature) {
      target.dead();
    }

    this.remove();
  }
}
