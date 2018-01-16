interface PhObject {
  id: number;
  box: SAT.Box;
}

interface Creature {
  id: number;
  role: "player" | "enemy";
  direction: number;
  speed: number;
  texture: number;
  object: number;
}

interface Terrain {
  id: number;
  type: "ground";
  texture: number;
  object: number;
}

const fromObject = ((id) => (box) => ({ id: id++, box }))(0);

const fromCreature = ((id) => (role, texture, object) => ({
  id,
  role,
  texture,
  object,
  speed: 0,
  direction: 0
}))(0);

const fromTexture = ((id) => (stat, left?, right?) => ({
  id,
  stat,
  left,
  right
}))(0);

const fromTerrain = ((id) => (type, texture, object) => ({
  id,
  type,
  texture,
  object
}))(0);

export const textureMap = {
  groundItem: 104,
  ground: 30,
  grass: 46,
  player: 160,
  enemy: 214
};

export const createObjectByTexId = (textureId, box: SAT.Box) => {
  let obj;
  switch (textureId) {
    case 104:
    case 30:
    case 46:
      const terrain = fromTerrain(
        "ground",
        fromTexture(textureId),
        fromObject(box)
      );
      break;
    case 160:
      const player = fromCreature(
        "player",
        fromTexture(textureId, 145, 160),
        fromObject(box)
      );
      break;
    case 214:
      const enemy = fromCreature(
        "enemy",
        fromTexture(textureId, 230, 230),
        fromObject(box)
      );
      break;
  }
  obj.textureId = textureId;
  return obj;
};
