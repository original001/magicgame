import {GroundItem} from './ground.js';
import Player from './player.js';
import Enemy from './enemy.js';

export const createObjectByTexId = (texId, model) => {
  let obj;
  switch (texId) {
    case 104:
    case 30:
    case 46:
      obj = new GroundItem(model);
      break;
    case 160:
      obj = new Player(model);
      break;
    case 214:
      obj = new Enemy(model);
      break;
  }
  obj.textureId = texId;
  return obj;
}