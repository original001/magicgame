export default class Key {
  _pressed = {};

  static LEFT = 'KeyA';
  static UP = 'Space';
  static RIGHT = 'KeyD';
  static ONE = 'Digit1';
  static TWO = 'Digit2';
  static THREE = 'Digit3';
  static FOUR = 'Digit4';

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
