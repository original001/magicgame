import SAT from 'sat';

export enum MovementMode {
  Static,
  Linear,
  Accelerate,
}

export default class WorldObject {
  pos: SAT.Vector;
  model: SAT.Box;
  color: string;
  private _exist: boolean;
  textureId: number;
  movementMode: MovementMode;
  constructor(model, color?) {
    this.pos = model.pos;
    this.model = model;
    this.color = color || '#ddd';
    this._exist = true;
    this.textureId = -1;
    this.movementMode = MovementMode.Static;
  }

  get exist() {
    return this._exist;
  }

  remove() {
    this._exist = false;
  }
}
