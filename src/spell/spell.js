import WorldObject from './../base.js';

export default class Spell extends WorldObject {
  startTime = 0;
  speed = 0;
  _resolve = () => {};
  promise = new Promise(resolve => {
    this._resolve = resolve;
  });

  /* abstract */
  update(tick) {throw ''}
  /* abstract */
  collide(target) {throw ''}
}
