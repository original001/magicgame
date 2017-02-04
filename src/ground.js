import WorldObject from './base.js';

export class Ground extends WorldObject {
  constructor() {
    super(-10000, canvas.offsetHeight - 100, 20000, 10000, '#ddd');
  }
}

export class GroundItem extends WorldObject {
  constructor(x, y, w, h) {
    super(x, y, w, h, '#ddd')
  }
  collideSpell() {}
}
