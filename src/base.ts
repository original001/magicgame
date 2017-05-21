import SAT from 'sat';

export default class WorldObject {
  pos: SAT.Vector;
  model: SAT.Box;
  color: string;
  private _exist: boolean;
  textureId: number;
  constructor(model, color) {
    this.pos = model.pos;
    this.model = model;
    this.color = color || '#ddd';
    this._exist = true;
    this.textureId = -1;
  }

  get exist() {
    return this._exist;
  }

  remove() {
    this._exist = false;
  }
}