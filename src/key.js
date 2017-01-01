export default class Key {
  _pressed = {};

  static LEFT = 'KeyA';
  static UP = 'Space';
  static RIGHT = 'KeyD';

  isDown(keyCode) {
      return this._pressed[keyCode];
  }

  onKeydown(event) {
      this._pressed[event.code] = true;
  }

  onKeyup(event) {
      delete this._pressed[event.code];
  }
};
