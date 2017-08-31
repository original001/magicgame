import KeyMap from './game';
import Player from './Player';
import World from './world';
import Browser from './browser';
import {satModel} from './satHelpers';
import Painter from './painter';
import scope, {IScope} from './scope';

scope.register('Browser', s => new Browser())
scope.register('Player', s => new Player(satModel(0, 0, 0, 0)))
scope.register('Painter', s => {
  const browser = s.find<Browser>('Browser');
  return new Painter(browser.canvas);
})
scope.register('KeyMap', s => {
  const player = s.find<Player>('Player');
  const browser = s.find<Browser>('Browser');
  return new KeyMap(browser, player);
})
scope.register('World', s => {
  const player = s.find<Player>('Player');
  const painter = s.find<Painter>('Painter');
  const keyMap = s.find<KeyMap>('KeyMap');
  return new World(player, painter, keyMap);
})

scope.find<World>('World').start();
