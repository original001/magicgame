export default class Key {
  _pressed = {};

  static LEFT = 'KeyA';
  static UP = 'Space';
  static RIGHT = 'KeyD';
  static FORCE = 'KeyE';
  static ONE = 'KeyY';
  static TWO = 'KeyU';
  static THREE = 'KeyI';
  static FOUR = 'KeyO';
  static FIVE = 'KeyP';

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
