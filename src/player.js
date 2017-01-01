import GravityObject from './gravity.js';

export default class Player extends GravityObject {
  constructor() {
    super(100, 350, 20, 50, 'white');
  }
  move(dir) {
    switch (dir) {
      case 'forward':
        this.right(5);
        break;
      case 'back':
        this.left(5);
        break;
      case 'up':
        this.jump(400);
        break;
    }
  }
  dead() {
    this.pos.x = -100000
  }
}
