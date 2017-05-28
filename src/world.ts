import WorldObject from './base';
import Player from './player';
import {Ground, GroundItem} from './ground';
import Enemy from './enemy';
import Creature from './creature';
import {SpellType, colors, createSpell} from './spell/fabric';
import data from '../maps/map.json';
import {createObjectByTexId, textureMap, initObjects} from "./fabric";
import {checkCollided, collideEnemy, collideGround} from './collides';
import {parseData} from './parseData';
import Painter from './painter';
import {recalc} from './recalc';

export default class World {
  private _spendTime: number;
  private ground: Ground[];
  private enemies: Enemy[];
  private spells: Array<any>;

  constructor(
    private player: Player,
    private painter: Painter,
    private onTick: () => void) {
    this._spendTime = 0;
    this.spells = [];
    this.addCreatures();
    this.update();
  }

  addCreatures() {
    const parsedData = parseData(data);
    const player = initObjects(parsedData, textureMap.player)[0];
    this.player.model = player.model;
    this.player.pos = player.pos;

    this.ground = initObjects(parsedData, textureMap.ground)
                    .concat(initObjects(parsedData, textureMap.groundItem))
                    .concat(initObjects(parsedData, textureMap.grass));
    this.enemies = initObjects(parsedData, textureMap.enemy);
  }

  createSpell(creature: Creature) {
    const spell = createSpell(creature);
    if (spell) {
      this.spells.push(spell);
    }
  }

  update(time = 0) {
    const tick = (time - this._spendTime) / 1000;
    this._spendTime = time;

    const {player, ground, enemies, spells} = this;
    const objects = [player, ...ground, ...enemies];

    this.clean();
    this.moveEnemies();
    this.onTick();
    recalc(tick, objects);
    this.collision();
    this.painter.drawElements(objects, player.pos);
    requestAnimationFrame(this.update.bind(this));
  }

  clean() {
    //todo: clear dead spells
    const {spells, enemies} = this;

    const unused = spells.filter(obj => !obj.exist);
    enemies.filter(obj => !obj.exist).forEach(elem => {
      enemies.splice(enemies.indexOf(elem), 1)
    })

    unused.forEach(elem => {
      spells.splice(spells.indexOf(elem), 1);
    })
  };

  moveEnemies() {
    this.enemies.forEach(enemy => {
      this.createSpell(enemy);
      if (this.player.pos.x > enemy.pos.x) {
        enemy.move('forward');
      } else if (this.player.pos.x < enemy.pos.x) {
        enemy.move('back');
      }
    });
  }

  collision() {
    checkCollided(this.enemies, this.player, collideEnemy);

    const creatures = [this.player, ...this.enemies];
    creatures.forEach(creature => {
      creature.mayJump = false;
      checkCollided(this.ground, creature, collideGround);

      checkCollided(this.spells, creature, (spell, creature) => {
        spell.collide(creature);
      })
    })

    this.ground.forEach(ground => {
      checkCollided(this.spells, ground, (spell, ground) => {
        spell.collide(ground);
      })
    })
  }
}
