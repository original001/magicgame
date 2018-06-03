import * as flyd from 'flyd';
import { Vector } from "sat";
import { indexOf } from "ramda";

export const abs = Math.abs;

export const vec = (x?: number, y?: number) => new Vector(x, y);

export const isVectorsEq = (v1: Vector, v2: Vector) =>
  v1.x === v2.x && v1.y === v2.y;

export const sign = (num: number) => (num === 0 ? 0 : num / abs(num));

export const next = <T>(ar: T[], el: T) => {
  var ind = indexOf(el, ar);
  if (ind >= ar.length - 1 || ind === -1) {
    return ar[0];
  }
  return ar[ind + 1];
};

export const nextByIndex = <T>(ar: T[], ind: number) => {
  if (ind >= ar.length - 1 || ind === -1) {
    return ar[0];
  }
  return ar[ind + 1];
};

export const nextByMod = <T>(ar: T[], ind: number): T => ar[ind % ar.length];
