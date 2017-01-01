import GravityObject from './gravity.js';
import WorldObject from './base.js';

export default class Player extends GravityObject {
  constructor() {
    super(100, 350, 20, 30, 'white');
  }
  move(dir) {
    switch (dir) {
      case 'forward':
        this.right(5.1);
        break;
      case 'back':
        this.left(5.1);
        break;
      case 'up':
        this.jump(300);
        break;
    }
  }
  spell(spell) {
    switch(spell) {
      case 'one':
        const ball = new WorldObject(this.pos.x, this.pos.y, 5, 5, 'blue');
    }
  }
  dead() {
    this.pos.x = -100000
  }
}
