import WorldObject from './../base.js';

export default class Spell extends WorldObject {
  speed = new SAT.Vector(0, 0);
  active = true;

  /* abstract */
  collide(target) {throw ''}
}
