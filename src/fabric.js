import {GroundItem} from './ground.js';

export const createObjectByTexId = (texId, model) => {
  let obj;
  switch (texId) {
    case 104:
    case 30:
      obj = new GroundItem(model);
      obj.textureId = texId; 
      break;
  }
  return obj;
}