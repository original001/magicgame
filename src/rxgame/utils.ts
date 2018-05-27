import { Vector } from "sat";

export const abs = Math.abs;

export const vec = (x?: number, y?: number) => new Vector(x, y);

export const sign = (num: number) => num === 0 ? 0 : num / abs(num);
