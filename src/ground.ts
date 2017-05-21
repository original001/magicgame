import WorldObject from './base';
import SAT from 'sat';
import {satModel} from './satHelpers';

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
