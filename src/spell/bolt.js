import Spell from './spell';
import Creature from './../creature';

export default class BoltSpell extends Spell {
  constructor(source) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
    const model = new SAT.Box(pos, 5, 5);
    super(model.pos.x, model.pos.y, model.w, model.h);
    this.model = model;
    this.pos = pos;
    this.speed.x = 400 * source.direction;
    this.color = 'blue';
    this.source = source;
    this.init();
  }
  init() {
    setTimeout(() => {
      this.active = false;
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
