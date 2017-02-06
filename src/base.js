import SAT from 'sat';

export default class WorldObject {
  constructor(model, color) {
    this.pos = model.pos;
    this.model = model;
    this.color = color || '#ddd';
    this.children = []
  }
}

