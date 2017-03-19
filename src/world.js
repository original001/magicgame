import WorldObject from './base.js';
import Player from './player.js';
import {Ground, GroundItem} from './ground.js';
import Enemy from './enemy.js';
import Key from './key';
import * as Spell from './spell/fabric.js';
import {G} from './constants.js';
import data from '../maps/map.json';
import {createObjectByTexId} from "./fabric.js";

const key = new Key();

const satModel = (x, y, w, h) => {
  return new SAT.Box(new SAT.Vector(x, y), w, h);
}

const satPos = (x, y) => {
  return new SAT.Vector(x, y);
}

const parseData = (data) => {
  const {tileheight, tilewidth, layers, height, width} = data;
  const dots = layers[0].data;
  const coords = dots.map((dot, ind) => {
    if (dot === 0) {
      return null;
    }
    const a = ind / width;
    const rows =  Math.floor(a);
    const y = rows;
    const x = ind - rows * width;
    return dot !== 0 ? {[dot - 1]: satModel(x * tilewidth, y * tileheight, tilewidth, tileheight)} : null
  }).filter(dot => !!dot);

  return coords;
}

const initObjects = (data, textureId) => {
  return data.filter(coord => {
    return coord.hasOwnProperty(textureId)
  }).map(coord => {
    return createObjectByTexId(textureId, coord[textureId]);
  })
}

const textureMap = {
  groundItem: 104,
  ground: 30,
  grass: 46,
  player: 160,
  enemy: 214
}

export default class World {
  constructor(screen) {
    this.screen = screen;
    this._spendTime = 0;

    this.addCreatures();
    this.attachEvents();
    this.update();
  }

  addCreatures() {
    const parsedData = parseData(data);
    this.player = initObjects(parsedData, textureMap.player)[0];
    this.ground = initObjects(parsedData, textureMap.ground)
                    .concat(initObjects(parsedData, textureMap.groundItem))
                    .concat(initObjects(parsedData, textureMap.grass));
    this.enemies = initObjects(parsedData, textureMap.enemy);
    this.spells = [];
  }

  update(time = 0) {
    const tick = (time - this._spendTime) / 1000;
    this._spendTime = time;

    this.clean();
    this.moveEnemies();
    this.checkKeys();
    this.updateObjects(tick);
    this.collision();
    this.fill();
    requestAnimationFrame(this.update.bind(this));
  }

  clean() {
    const {spells} = this;

    const unused = spells.filter(obj => !obj.exist);

    unused.forEach(elem => {
      spells.splice(spells.indexOf(elem), 1);
    })
  };

  updateObjects(tick) {
    const creatures = [this.player].concat(this.enemies);
    creatures.forEach(creature => {
      if (creature.frozen) return;
      creature.pos.x += creature.speed.x * tick;
      creature.speed.x = 0;
      creature.pos.y = creature.pos.y - creature.speed.y * tick + G * tick * tick / 2; 
      creature.speed.y -= G;
      creature.color = creature.enabledSpells[0] ? Spell.colors[creature.enabledSpells[0]] : 'black';
    });
    this.spells.forEach(spell => {
      spell.pos.x += spell.speed.x * tick;
    })
  }

  moveEnemies() {
    this.enemies.forEach(enemy => {
      this.spell(enemy, Spell.BOLT);
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

  fill() {
    const {player, ground, enemies, spells} = this;
    this.screen.addElements([player, ...ground, ...enemies, ...spells], player.pos);
  }

  spell(creature) {
    const spell = Spell.createSpell(creature);

    if (spell) {
      this.spells.push(spell);
    }
  }

  checkKeys() {
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
      this.spell(this.player);
    }
    if (key.isDown(Key.CHANGE)) {
      this.player.changeSpell();
    }
  }

  attachEvents() {
    document.addEventListener('keydown', (e) => key.onKeydown(e), false)
    document.addEventListener('keyup', (e) => key.onKeyup(e), false)
  }
}

const checkCollided = (objects, subject, callback) => {
  objects.forEach(obj => {
    const responce = new SAT.Response();
    const collided = SAT.testPolygonPolygon(subject.model.toPolygon(), obj.model.toPolygon(), responce);
    if (collided) {
      callback.call(null, obj, subject, responce);
    }
  }) 
}

const collideEnemy = (enemy, player, responce) => {
  if (Math.abs(responce.overlapN.x) > 0) {
    player.dead();
  } else {
    enemy.dead();
    player.enabledSpells = player.enabledSpells.concat(enemy.enabledSpells);
  }
}

const collideGround = (ground, creature, responce) => {
  if (ground && responce.overlap > 0) {
    if (ground instanceof Ground) {
      creature.pos.y = ground.pos.y - creature.model.h;
      creature.speed.y = 0;
      creature.mayJump = true;
    }

    if (ground instanceof GroundItem) {
      if (responce.overlapN.x > 0) {
        creature.pos.x = ground.pos.x - creature.model.w;
      }
      if (responce.overlapN.x < 0) {
        creature.pos.x = ground.pos.x + ground.model.w;
      }
      if (responce.overlapN.y > 0) {
        creature.pos.y = ground.pos.y - creature.model.h;
        creature.speed.y = 0;
        creature.mayJump = true;
      }
      if (responce.overlapN.y < 0) {
        creature.speed.y = 0;
        creature.pos.y = ground.pos.y + ground.model.h;
      }
    }
  }
}
