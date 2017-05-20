import {satModel, satPos} from "./satHelpers.js";

export const parseData = (data) => {
  const {tileheight, tilewidth, layers, height, width} = data;
  const dots = layers[0].data;
  const coords = dots.map((dot, ind) => {
    if (dot === 0) {
      return null;
    }
    const a = ind / width;
    const rows =  Math.floor(a);
    const y = rows;
    const x = ind - rows * width;
    return dot !== 0 ? {[dot - 1]: satModel(x * tilewidth, y * tileheight, tilewidth, tileheight)} : null
  }).filter(dot => !!dot);

  return coords;
}
