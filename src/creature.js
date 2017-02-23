import WorldObject from './base.js';
import SAT from 'sat';

export default class Creature extends WorldObject {
  speed = new SAT.Vector(0, 0);
  frozen = false;
  direction = 1;
  enabledSpells = [];
  mayJump = false;
  movespeed = new SAT.Vector(200, 300);
  move(dir) {
    switch (dir) {
      case 'forward':
        this.speed.x = this.movespeed.x
        this.direction = 1;
        break;
      case 'back':
        this.speed.x = -this.movespeed.x
        this.direction = -1;
        break;
      case 'up':
        if (!this.mayJump) return;
        this.speed.y = this.movespeed.y;
        break;
    }
  }
  dead() {
    this.pos.x = -100000
  }
  freeze() {
    this.frozen = true;
  }
}