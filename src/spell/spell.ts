import WorldObject from './../base';
import SAT from 'sat';

export interface Spell {
  speed: SAT.Vector;

  collide(target);
}
