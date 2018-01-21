import { fromModel, fromVector, fromBox } from "./satHelpers";
import { MyMap } from "../../maps/map";
import * as SAT from "sat";
import { last } from "ramda";

export const getCoordsFromList = (ind, columns): SAT.Vector => {
  const a = ind / columns;
  const rows = Math.floor(a);
  const y = rows;
  const x = ind - rows * columns;
  return fromVector(x, y);
};

export const parseData = (data: MyMap) => {
  const { tileheight, tilewidth, layers, height, width } = data;
  const dots = layers[0].data;
  const coords = dots.reduce((acc, dot, ind) => {
    if (dot === 0) {
      return acc;
    }
    const coord = getCoordsFromList(ind, width);
    return acc.concat([
      [dot - 1, fromModel(coord.scale(20, 20), tilewidth, tileheight)]
    ]);
  }, [] as [ number, SAT.Box ][]);

  return coords;
};
