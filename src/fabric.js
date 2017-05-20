import {GroundItem} from './ground.js';
import Player from './player.js';
import Enemy from './enemy.js';

export const initObjects = (data, textureId) => {
  return data.filter(coord => {
    return coord.hasOwnProperty(textureId)
  }).map(coord => {
    return createObjectByTexId(textureId, coord[textureId]);
  })
}

export const textureMap = {
  groundItem: 104,
  ground: 30,
  grass: 46,
  player: 160,
  enemy: 214
}

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
