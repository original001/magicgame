import Creature from '../src/creature';
import SAT from 'sat';
import {satModel} from '../src/satHelpers';
import {checkCollided, collideGround, collideEnemy} from '../src/collides';
import {recalc} from '../src/recalc';
import {GroundItem} from '../src/ground'
import Player from '../src/player';
import Enemy from '../src/enemy';
import BoltSpell from '../src/spell/bolt';
import TakeSpell from '../src/spell/take';
import {SpellType} from '../src/spell/fabric';
import WorldObject, {MovementMode} from '../src/base';
import {G} from '../src/constants';

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
    const player = new Player(satModel(10, 10, 10, 10));
    player.speed.y = 1000
    const ground = new GroundItem(satModel(10, 20 - 1, 10, 10))

    checkCollided([ground], player, collideGround);

    expect(player.speed.y).toBe(0);
    expect(player.pos.y).toBe(9);
  })
  it('should not stop', () => {
    const player = new Player(satModel(10, 10, 10, 10));
    player.speed.x = 1000
    const ground = new GroundItem(satModel(20 - 1, 10, 10, 10))

    checkCollided([ground], player, collideGround);

    expect(player.pos.x).toBe(9);
  })

  it('should defeat enemy', () => {
    const player = new Player(satModel(10, 10, 10, 10));
    const enemy = new Enemy(satModel(10, 20 - 1, 10, 10))

    checkCollided([enemy], player, collideEnemy);

    expect(player.exist).toBe(true);
    expect(enemy.exist).toBe(false);
  })

  it('should die by enemy', () => {
    const player = new Player(satModel(10, 10, 10, 10));
    const enemy = new Enemy(satModel(20 - 1, 10, 10, 10))

    checkCollided([enemy], player, collideEnemy);

    expect(player.exist).toBe(false);
    expect(enemy.exist).toBe(true);
  })

})

describe('recalc', function() {
  beforeEach(() => {
    this.player = new Player(satModel(10, 10, 10, 10));
  })
  afterEach(() => {
    this.player = null;
  })
  it('should stay', () => {
    const prevPos = this.player.pos.x;
    recalc(20, [this.player]);
    const nextPos = this.player.pos.x;
    expect(prevPos).toBe(nextPos);
  })

  it('should move', () => {
    const prevPos = this.player.pos.x;
    this.player.move('forward');
    recalc(20, [this.player]);
    const nextPos = this.player.pos.x;
    expect(prevPos).toBeLessThan(nextPos);
  })

  it('should jump', () => {
    const prevPos = this.player.pos.y;
    this.player.move('up');
    recalc(20, [this.player]);
    const nextPos = this.player.pos.y;
    expect(prevPos).toBeLessThan(nextPos);
  })

  it('should right move in Accelerate mode', () => {
    const obj = new WorldObject(satModel(10, 10, 10, 10));
    obj.movementMode = MovementMode.Accelerate;
    obj.speed = new SAT.Vector(400, 400);

    const prevPos = obj.pos.x;
    const prevPosY = obj.pos.y;
    recalc(20, [obj]);
    const nextPos = obj.pos.x;
    const nextPosY = obj.pos.y;
    expect(nextPos).toBe(10 + 20 * 400);
    expect(nextPosY).toBe(10 - 400 * 20 + G * 20 * 20 / 2)
    recalc(20, [obj]);
    const secondPos = obj.pos.x;
    const secondPosY = obj.pos.y;
    expect(secondPos).toBe(nextPos + 20 * 400);
    const newSpeed = 400 - G * 20;
    expect(secondPosY).toBe(nextPosY - newSpeed * 20 + G * 20 * 20 / 2);
  })

  it('should right move in Linear mode', () => {
    const obj = new WorldObject(satModel(10, 10, 10, 10));
    obj.movementMode = MovementMode.Linear;
    obj.speed = new SAT.Vector(400, 400);

    const prevPos = obj.pos.x;
    const prevPosY = obj.pos.y;
    recalc(20, [obj]);
    const nextPos = obj.pos.x;
    const nextPosY = obj.pos.y;
    expect(nextPos).toBe(10 + 20 * 400);
    expect(nextPosY).toBe(10 + 20 * 400);
    recalc(20, [obj]);
    const secondPos = obj.pos.x;
    const secondPosY = obj.pos.y;
    expect(secondPos).toBe(nextPos + 20 * 400);
    expect(secondPosY).toBe(nextPosY + 20 * 400);
  })
})

describe('spells', function() {
  it('should defeat enemy', () => {
    const player = new Player(satModel(10, 10, 10, 10));
    const spell = new BoltSpell(player);
    const enemy = new Enemy(satModel(10, 10, 10, 10));

    spell.collide(enemy);

    expect(enemy.exist).toBeFalsy();
  })
  it('should take spell from enemy', () => {
    const player = new Player(satModel(10, 10, 10, 10));
    const spell = new TakeSpell(player);
    const enemy = new Enemy(satModel(10, 10, 10, 10), SpellType.BOLT);

    spell.collide(enemy);

    expect(player.enabledSpells.length).toBe(2);
    expect(enemy.enabledSpells.length).toBe(0);
  })
})

describe('animations', () => {
  it('', () => {
    const creature = new Creature(satModel(10, 10, 10, 10));
    creature.textureIdRight = 1;
    creature.textureId = 0;

    creature.move('forward');
  })
})
