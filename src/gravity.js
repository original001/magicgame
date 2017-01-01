import WorldObject from 'base.js';
import {G} from 'constants.js';

export default class GravityObject extends WorldObject {
  speed = 0;

  right(to) {
    this.pos.x += to;  
  }
  left(to) {
    this.pos.x -= to;
  }

  gravity(tick) {
    this.pos.y = this.pos.y - this.speed * tick + G * tick * tick / 2; 
    this.speed -= G;
  }

  jump(speed) {
    if (this.speed !== 0) return;
    log(`speed ${speed}`)
    this.speed = speed;
    this.pos.y -= 1
  }

  collide(obj, res) {
    if (obj instanceof Ground) {
      this.pos.y = obj.pos.y - this.model.h;
      this.speed = 0;
    }

    if (obj instanceof GroundItem) {
      if (res.overlapN.x > 0) {
        this.pos.x = obj.pos.x - this.model.w;
      }
    }
  }
}