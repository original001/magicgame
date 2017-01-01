import WorldObject from './base.js';
import {G} from './constants.js';

export default class GravityObject extends WorldObject {
  speed = 0;
  frozen = false;
  direction = 1;

  right(to) {
    if (this.frozen) return;
    this.pos.x += to;  
    this.direction = 1;
  }
  
  left(to) {
    if (this.frozen) return;
    this.pos.x -= to;
    this.direction = -1;
  }

  gravity(tick) {
    if (this.frozen) return;
    this.pos.y = this.pos.y - this.speed * tick + G * tick * tick / 2; 
    this.speed -= G;
  }

  jump(speed) {
    if (this.speed !== 0) return;
    this.speed = speed;
    this.pos.y -= 1
  }

  freeze() {
    this.frozen = true;
  }
}