import * as SAT from 'sat';

export const fromBox = (x, y, w, h) => {
  return new SAT.Box(new SAT.Vector(x, y), w, h);
}

export const fromModel = (v: SAT.Vector, w, h) => {
  return new SAT.Box(v, w, h)
}

export const fromVector = (x, y) => {
  return new SAT.Vector(x, y);
}
