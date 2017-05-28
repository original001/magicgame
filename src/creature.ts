import WorldObject from './base';
import SAT from 'sat';
import {MovementMode} from './base';

export default class Creature extends WorldObject {
  speed = new SAT.Vector(0, 0);
  frozen = false;
  direction = 1;
  enabledSpells = [];
  mayJump = false;
  movespeed = new SAT.Vector(200, 300);
  movementMode = MovementMode.Accelerate;
  private timer: number;
  move(dir) {
    switch (dir) {
      case 'forward':
        this.speed.x = this.movespeed.x
        this.setDirection(1);
        break;
      case 'back':
        this.speed.x = -this.movespeed.x
        this.setDirection(-1);
        break;
      case 'up':
        if (!this.mayJump) return;
        this.speed.y = this.movespeed.y;
        break;
      case 'stop':
        this.stopAnimation();
    }
  }
  setDirection(dir) {
    if (dir === this.direction) return;

    this.direction = dir;
    this.setAnimations();
  }
  dead() {
    this.remove()
  }
  freeze() {
    this.frozen = true;
  }

  setAnimations() {
    switch(this.direction) {
      case 1:
        this.setAnimation(this.textureIdsRight)
        break;
      case -1:
        this.setAnimation(this.textureIdsLeft)
        break;
      case 0:
        this.stopAnimation();
        break;
    }
  }

  stopAnimation() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.textureId = this.direction === 1 ? this.textureIdRight : this.textureIdLeft;
  }

  setAnimation(ids) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (!ids) return;
    if (typeof ids === 'number') {
      this.textureId = ids;
      return;
    }

    let i = 0
    this.timer = setInterval(() => {
      this.textureId = ids[i];
      i === ids.length - 1 ? i = 0 : i++;
    }, 100);
  }
}
