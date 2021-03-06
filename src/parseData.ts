import { MyMap } from "../maps/map";
import * as SAT from "sat";

export const fromModel = (v: SAT.Vector, w, h) => {
  return new SAT.Box(v, w, h)
}

export const fromVector = (x, y) => {
  return new SAT.Vector(x, y);
}

export const getCoordsFromList = (ind, columns): SAT.Vector => {
  const a = ind / columns;
  const rows = Math.floor(a);
  const y = rows;
  const x = ind - rows * columns;
  return fromVector(x, y);
};

export const getBoxes = (map: MyMap) => {
  const { tileheight, tilewidth, layers, width } = map;
  const dots = layers[0].data;
  const coords = dots.reduce(
    (acc, dot, ind) => {
      if (dot === 0) {
        return acc;
      }
      const coord = getCoordsFromList(ind, width);
      return acc.concat([
        [dot - 1, fromModel(coord.scale(20, 20), tilewidth, tileheight)]
      ]);
    },
    [] as [number, SAT.Box][]
  );

  return coords;
};

export const getAnimations = (id: number, map: MyMap): number[] => {
  const [{ tiles }] = map.tilesets;
  return tiles[id].animation.reduce(
    (acc, animation) => acc.concat(animation.tileid),
    []
  );
};
