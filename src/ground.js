import WorldObject from './base.js';

export class Ground extends WorldObject {
  constructor() {
    super(0, canvas.offsetHeight - 100, canvas.offsetWidth, 100, '#ddd');
  }
}

export class GroundItem extends WorldObject {
  constructor(x, y, w, h) {
    super(x, y, w, h, '#ddd')
  }
}
