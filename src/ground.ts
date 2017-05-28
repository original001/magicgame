import WorldObject from './base';
import SAT from 'sat';
import {satModel} from './satHelpers';

export class GroundItem extends WorldObject {
  constructor(model) {
    super(model, '#ddd')
  }
}
