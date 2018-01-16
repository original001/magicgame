import { fromModel, fromVector, fromBox } from "./satHelpers";
import { MyMap } from "../../maps/map";
import * as SAT from "sat";
import { last } from "ramda";

//todo: add tests
export const getCoordsFromList = (ind, columns) => {
  const a = ind / columns;
  const rows = Math.floor(a);
  const y = rows;
  const x = ind - rows * columns;
  return fromVector(x, y);
};

//todo: add tests
export const parseData = (data: MyMap): { [id: number]: SAT.Box }[] => {
  const { tileheight, tilewidth, layers, height, width } = data;
  const dots = layers[0].data;
  const coords = dots.reduce((acc, dot, ind) => {
    if (dot === 0) {
      return acc;
    }
    acc.push({
      [dot - 1]: fromModel(getCoordsFromList(ind, width), tilewidth, tileheight)
    });
  }, []);

  return coords;
};
