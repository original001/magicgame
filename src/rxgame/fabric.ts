export interface Entity {
  id: number;
  texture: number;
  box: SAT.Box;
}

export const fromEntity = ((id) => (texture: number, box): Entity => ({
  id: id++,
  texture,
  box,
}))(0);

export const textureMap = {
  groundItem: 104,
  ground: 30,
  grass: 46,
  player: 160,
  enemy: 214
};
