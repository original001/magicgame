import Spell from './spell';

export default class TakeSpell extends Spell {
  constructor(source) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
    const model = new SAT.Box(pos, 10, 10);
    super(model.pos.x, model.pos.y, model.w, model.h);
    this.model = model;
    this.pos = pos;
    this.speed.x = 400 * source.direction;
    this.color = 'gray';
    this.source = source;
    this.init();
  }

  init() {
    setTimeout(() => {
      this.active = false;
      this.remove()
    }, 150);
  }

  /* ovveride */
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