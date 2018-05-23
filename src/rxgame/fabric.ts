export interface Entity {
  id: number;
  texture: Texture;
  box: SAT.Box;
}

export interface Creature extends Entity {
  id: number;
  type: "player" | "enemy";
  direction: number;
  speed: number;
  texture: Texture;
}

export interface Terrain extends Entity {
  id: number;
  type: "ground";
  texture: Texture;
}

export interface Texture {
  stat: number,
  left?: number,
  right?: number,
}

export const fromEntity = ((id) => (texture: Texture, box): Entity => ({
  id: id++,
  texture,
  box,
}))(0);

const fromCreature = ((id) => (type, texture: Texture, box): Creature => ({
  id: id++,
  type,
  texture,
  box,
  speed: 0,
  direction: 0
}))(0);

const fromTexture = (stat, left?, right?): Texture => ({
  stat,
  left,
  right
});

const fromTerrain = ((id) => (type, texture: Texture, box): Terrain => ({
  id: id++,
  type,
  texture,
  box
}))(0);

export const textureMap = {
  groundItem: 104,
  ground: 30,
  grass: 46,
  player: 160,
  enemy: 214
};

export const createObjectByTexId = (textureId, box: SAT.Box): Entity => {
  switch (textureId) {
    case 104:
    case 30:
    case 46:
      return fromTerrain("terrain", fromTexture(textureId), box);
    case 160:
      return fromCreature(
        "player",
        fromTexture(textureId, 145, 160),
        box
      );
    case 214:
      return fromCreature(
        "enemy",
        fromTexture(textureId, 230, 230),
        box
      );
  }
};
