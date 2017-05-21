import WorldObject from './../base';

export default class Spell extends WorldObject {
  speed = new SAT.Vector(0, 0);
  active = true;

  /* abstract */
  collide(target) {throw ''}
}
