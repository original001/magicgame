import {key, Key} from './key';

export default class Browser {
  canvas: HTMLCanvasElement;
  keyboard: Key;
  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.attachEvents();
  }

  attachEvents() {
    document.addEventListener('keydown', (e) => key.onKeydown(e), false)
    document.addEventListener('keyup', (e) => key.onKeyup(e), false)
  }
}
