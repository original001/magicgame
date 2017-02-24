import WorldObject from './base.js';
import SAT from 'sat';

const satModel = (x, y, w, h) => {
  return new SAT.Box(new SAT.Vector(x, y), w, h);
}

export class Ground extends WorldObject {
  constructor() {
    super(satModel(-10000, canvas.offsetHeight - 100, 20000, 10000), '#ddd');
  }
}

export class GroundItem extends WorldObject {
  constructor(model) {
    super(model, '#ddd')
  }
}
