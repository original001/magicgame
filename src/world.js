import WorldObject from './base.js';
import Player from './player.js';
import {Ground, GroundItem} from './ground.js';
import Enemy from './enemy.js';
import Key from './key';
import * as spell from './spell/fabric.js';
import {G} from './constants.js';

const key = new Key();

export default class World {
  constructor(screen) {
    this.screen = screen;
    this._spendTime = 0;

    this.addCreatures();
    this.attachEvents();
    this.update();
  }

  addCreatures() {
    this.player = new Player();
    this.ground = [new Ground(), new GroundItem(200, 320, 100, 20), new GroundItem(150, 370, 10, 50), new GroundItem(0, 200, 50, 300)];
    this.enemies = [new Enemy(1000, 350, spell.BOLT), new Enemy(370, 350), new Enemy(1400, 350)];
    this.spells = [];
  }

  update(time = 0) {
    const tick = (time - this._spendTime) / 1000;
    this._spendTime = time;

    this.moveEnemies(tick);
    this.checkKeys();
    this.updateObjects(tick);
    this.collision(tick);
    this.fill();
    requestAnimationFrame(this.update.bind(this));
  }

  updateObjects(tick) {
    const creatures = [this.player].concat(this.enemies);
    creatures.forEach(creature => {
      if (creature.frozen) return;
      creature.pos.x += creature.speed.x * tick;
      creature.speed.x = 0;
      creature.pos.y = creature.pos.y - creature.speed.y * tick + G * tick * tick / 2; 
      creature.speed.y -= G;
      creature.color = creature.enabledSpells[0] ? spell.colors[creature.enabledSpells[0]] : 'black';
    });
    this.spells.forEach(spell => {
      spell.update(tick);
    })
  }

  moveEnemies(tick) {
    this.enemies.forEach(enemy => {
      this.spell(enemy, spell.BOLT);
      if (this.player.pos.x > enemy.pos.x) {
        enemy.move('forward');
      } else if (this.player.pos.x < enemy.pos.x) {
        enemy.move('back');
      }
    });
  }

  collision(tick) {
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
    const isSpellEnabled = creature.enabledSpells.length > 0;
    if (!isSpellEnabled || creature.isSpellWorking) return;

    creature.isSpellWorking = true;

    const activeSpell = spell.createSpell(creature, creature.enabledSpells[0]);

    this.spells.push(activeSpell);

    activeSpell.promise.then(() => {
      creature.isSpellWorking = false;
      const ind = this.spells.indexOf(activeSpell);
      this.spells.splice(ind, 1);
    })
  }

  changeSpell(creature) {
    const spells = creature.enabledSpells;
    creature.enabledSpells = [...spells.slice(1), spells[0]];
  }

  checkKeys() {
    if (key.isDown(Key.RIGHT)) {
      this.player.move('forward');
    }
    if (key.isDown(Key.LEFT)) {
      this.player.move('back');
    }
    if (key.isDown(Key.UP)) {
      this.player.move('up');
    }
    if (key.isDown(Key.FORCE)) {
      this.spell(this.player);
    }
    if (key.isDown(Key.CHANGE)) {
      this.changeSpell(this.player);
    }
    if (key.isDown(Key.ONE)) {
      this.spell(this.player, spell.BOLT);
    }
    if (key.isDown(Key.TWO)) {
      this.spell(this.player, spell.TELEPORT);
    }
    if (key.isDown(Key.THREE)) {
      this.spell(this.player, spell.FREEZE);
    }
    if (key.isDown(Key.FOUR)) {
      this.spell(this.player, spell.KICK);
    }
    if (key.isDown(Key.FIVE)) {
      this.spell(this.player, spell.FIRE);
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
