import {Spell} from './spell';
import SAT from 'sat';
import Creature from '../creature';
import WorldObject, {MovementMode} from '../base';

export default class TeleportSpell  extends WorldObject implements Spell {
  speed: SAT.Vector;
  source: Creature;
  constructor(source: Creature) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y); //copypast
    const model = new SAT.Box(pos, 10, 10);
    super(model, 'red');
    this.movementMode = MovementMode.Accelerate;
    this.speed = new SAT.Vector(400 * source.direction, 100);
    this.source = source;
  }

  collide(target) {
    const source = this.source;
    if (target === source) return; // copypast
    source.pos.x = target.pos.x;
    source.pos.y = target.pos.y - 50;
    this.remove();
  }
}
