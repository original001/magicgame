/* @flow */
declare module 'sat' {
  declare class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number): Vector;
  }
  declare class Box {
    pos: Vector;
    width: number;
    height: number;
    constructor(pos: Vector, w: number, h: number): Box;
  }

  declare module.exports: {
    Vector: Vector,
    Box: Box,
  }
}
