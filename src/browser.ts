import {Key} from './key';

export default class Browser {
  canvas: HTMLCanvasElement;
  keyboard: Key = new Key();
  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.attachEvents();
  }

  attachEvents() {
    document.addEventListener('keydown', (e) => this.keyboard.onKeydown(e), false)
    document.addEventListener('keyup', (e) => this.keyboard.onKeyup(e), false)
  }
}
