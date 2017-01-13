import WorldObject from './base.js';
import SAT from 'sat';

export default class GravityObject extends WorldObject {
  speed = new SAT.Vector(0, 0);
  frozen = false;
  direction = 1;

  jump(speed) {
    if (this.speed.y !== 0) return;
    this.speed.y = speed;
    this.pos.y -= 1
  }

  freeze() {
    this.frozen = true;
  }
}