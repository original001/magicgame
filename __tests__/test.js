import Creature from '../src/creature';
import SAT from 'sat';
import {satModel} from '../src/satHelpers';
import {checkCollided, collideGround, collideEnemy} from '../src/collides';
import {Ground, GroundItem} from '../src/ground'
import Player from '../src/player';
import Enemy from '../src/enemy';

const model = satModel(1, 1, 1, 1);

describe('should', () => {
  it('be true', () => {
    expect(true).toBe(true);
  })
  it('change direction', () => {
    const creature = new Creature(model);
    creature.move('back');
    expect(creature.direction).toBe(-1);
    creature.move('forward');
    expect(creature.direction).toBe(1);
  })

  it('should stop', () => {
    const player = new Player(satModel(10, 10, 10, 10, 'white'));
    player.speed.y = 1000
    const ground = new GroundItem(satModel(10, 20 - 1, 10, 10))

    checkCollided([ground], player, collideGround);

    expect(player.speed.y).toBe(0);
    expect(player.pos.y).toBe(9);
  })
  it('should not stop', () => {
    const player = new Player(satModel(10, 10, 10, 10, 'white'));
    player.speed.x = 1000
    const ground = new GroundItem(satModel(20 - 1, 10, 10, 10))

    checkCollided([ground], player, collideGround);

    expect(player.pos.x).toBe(9);
  })

  it('should defeat enemy', () => {
    const player = new Player(satModel(10, 10, 10, 10, 'white'));
    const enemy = new Enemy(satModel(10, 20 - 1, 10, 10))

    checkCollided([enemy], player, collideEnemy);

    expect(player.exist).toBe(true);
    expect(enemy.exist).toBe(false);
  })

  it('should die by enemy', () => {
    const player = new Player(satModel(10, 10, 10, 10, 'white'));
    const enemy = new Enemy(satModel(20 - 1, 10, 10, 10))

    checkCollided([enemy], player, collideEnemy);

    expect(player.exist).toBe(false);
    expect(enemy.exist).toBe(true);
  })
})
