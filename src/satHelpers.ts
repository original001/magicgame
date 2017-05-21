import SAT from 'sat';

export const satModel = (x, y, w, h) => {
  return new SAT.Box(new SAT.Vector(x, y), w, h);
}

export const satPos = (x, y) => {
  return new SAT.Vector(x, y);
}
