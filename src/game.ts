import Player from './Player';
import World from './world';
import Browser from './browser';
import {satModel} from './satHelpers';
import Painter from './painter';
import {Key} from './key';

export default class Game {
  browser: Browser;
  world: World;
  player: Player;

  constructor() {
    this.browser = new Browser();
    this.player = new Player(satModel(0, 0, 0, 0))
    this.world = new World(this.player, new Painter(this.browser.canvas), this.handleTick)
  }

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
      this.player.createSpell()
    }
    if (key.isDown(Key.CHANGE)) {
      this.player.changeSpell();
    }
  }

  start() {};
}
