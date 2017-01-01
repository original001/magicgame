import SAT from 'sat';

export default class WorldObject {
  constructor(x, y, w, h, color) {
    this.pos = new SAT.Vector(x, y);
    this.model = new SAT.Box(this.pos, w, h);
    this.color = color || '#ddd';
  }
}

