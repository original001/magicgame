import Spell from './spell';

export default class BoltSpell extends Spell {
  constructor(source) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
    const model = new SAT.Box(pos, 5, 5);
    super(model.pos.x, model.pos.y, model.w, model.h);
    this.model = model;
    this.pos = pos;
    this.speed = 400 * source.direction;
    this.color = 'blue';
    this.source = source;
  }
  /* ovveride */
  update(tick) {
    if (this.startTime > 2) {
      this._resolve();
    }
    this.pos.x += tick * this.speed;
    this.startTime += tick;
  }
  /* ovveride */
  collide(target) {
    if (target === this.source) return;
    target.dead();
    this._resolve();
  }
}
