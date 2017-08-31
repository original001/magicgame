import WorldObject from './base';
import Player from './player';
import {GroundItem} from './ground';
import Enemy from './enemy';
import Creature from './creature';
import {SpellType, colors, createSpell} from './spell/fabric';
import {createObjectByTexId, textureMap, initObjects} from "./fabric";
import {checkCollided, collideEnemy, collideGround} from './collides';
import {parseData} from './parseData';
import Painter from './painter';
import {recalc} from './recalc';
import KeyMap from './game';
const data = require('../maps/map.json');

export default class World {
  private _spendTime: number;
  private grounds: GroundItem[];
  private enemies: Enemy[];
  private spells: Array<any>;
  private onTick: () => void;

  constructor(
    private player: Player,
    private painter: Painter,
    keyMap: KeyMap) {
    this.onTick = keyMap.handleTick;
    this._spendTime = 0;
    this.spells = [];
  }

  start() {
    this.addCreatures();
    this.update();
  }

  addCreatures() {
    //todo: extract initObjects invoke
    const parsedData = parseData(data);
    const player = initObjects(parsedData, textureMap.player)[0];
    this.player.model = player.model;
    this.player.pos = player.pos;

    this.grounds = initObjects(parsedData, textureMap.ground)
                    .concat(initObjects(parsedData, textureMap.groundItem))
                    .concat(initObjects(parsedData, textureMap.grass));
    this.enemies = initObjects(parsedData, textureMap.enemy);
  }

  update(time = 0) {
    const tick = (time - this._spendTime) / 1000;
    this._spendTime = time;

    const {player, grounds, enemies, spells} = this;
    const objects = [player, ...grounds, ...enemies, ...spells];

    this.clean();
    this.moveEnemies();
    this.createSpells();
    this.onTick();
    recalc(tick, objects);
    this.collision();
    this.painter.drawElements(objects, player.pos);
    requestAnimationFrame(this.update.bind(this));
  }

  createSpells() {
    if (this.player.activeSpell) {
      const spell = createSpell(this.player);
      this.player.flushSpell();
      if (spell) {
        this.spells.push(spell);
      }
    }
  }

  clean() {
    this.spells = this.spells.filter(spell => spell.exist);
    this.enemies = this.enemies.filter(enemy => enemy.exist);

    // enemies.filter(obj => !obj.exist).forEach(elem => {
    //   enemies.splice(enemies.indexOf(elem), 1)
    // })
  };

  moveEnemies() {
    this.enemies.forEach(enemy => {
      // enemy.createSpell();
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
      checkCollided(this.grounds, creature, collideGround);

      checkCollided(this.spells, creature, (spell, creature) => {
        spell.collide(creature);
      })
    })

    this.grounds.forEach(ground => {
      checkCollided(this.spells, ground, (spell, ground) => {
        spell.collide(ground);
      })
    })
  }
}
