import {Spell} from './spell';
import SAT from 'sat';
import Creature from '../creature';
import WorldObject, {MovementMode} from '../base';

export default class FlySpell extends WorldObject implements Spell {
  speed: SAT.Vector;
  source: Creature;
  constructor(source: Creature) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y);
    const model = new SAT.Box(pos, 10, 10);
    super(model, 'gray');
    this.movementMode = MovementMode.Static;
    this.source = source;
    this.init();
  }

  init() {
    this.source.G = 1;
  }

  collide(target) {}
}
