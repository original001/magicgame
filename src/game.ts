import Player from './Player';
import World from './world';
import Browser from './browser';
import {satModel} from './satHelpers';
import Painter from './painter';
import {Key} from './key';
import scope, {IScope} from './scope';

export default class KeyMap {
  constructor(private browser: Browser, private player: Player) {}

  handleTick = () => {
    const key = this.browser.keyboard;
    if (key.isDown(Key.RIGHT)) {
      this.player.move('forward');
    }
    if (key.isDown(Key.LEFT)) {
      this.player.move('back');
    }
    if (!key.isDown(Key.LEFT) && !key.isDown(Key.RIGHT)) {
      this.player.move('stop');
    }

    if (key.isDown(Key.UP)) {
      this.player.move('up');
    }
    if (key.isDown(Key.FORCE)) {
      this.player.createSpell();
    }
    if (key.isDown(Key.CHANGE)) {
      this.player.changeSpell();
    }
  }
}
