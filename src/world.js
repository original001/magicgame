import WorldObject from './base.js';
import Player from './player.js';
import {Ground, GroundItem} from './ground.js';
import Enemy, {MagicEnemy} from './enemy.js';
import SAT from 'sat';
import Key from './key';
import Spell, * as spell from './spell.js';
import {G} from './constants.js';

const key = new Key();

const checkCollided = (objects, subject, response) => {
  let collidedObject = null;
  objects.some(obj => {
    const collided = SAT.testPolygonPolygon(subject.model.toPolygon(), obj.model.toPolygon(), response);
    if (collided) {
      collidedObject = obj;
    }
    return collided;
  }) 
  return collidedObject;
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
    this.player = new Player();
    this.ground = [new Ground(), new GroundItem(200, 320, 100, 20)];
    this.enemies = [new MagicEnemy(300, 370, spell.BOLT), new Enemy(370, 350)];
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
      creature.children.forEach(obj => obj.update(tick));
      if (creature.frozen) return;
      creature.pos.x += creature.speed.x * tick;
      creature.speed.x = 0;
      creature.pos.y = creature.pos.y - creature.speed.y * tick + G * tick * tick / 2; 
      creature.speed.y -= G;
    });

  }

  moveEnemies(tick) {
    this.enemies.forEach(enemy => {
      enemy.spell(spell.BOLT);
      if (this.player.pos.x > enemy.pos.x) {
        enemy.move('forward');
      } else {
        enemy.move('back');
      }
    });
  }

  collision(tick) {
    const response = new SAT.Response();  

    const collidedEnemy = checkCollided(this.enemies, this.player, response);

    if (collidedEnemy) {
      if (Math.abs(response.overlapN.x) > 0) {
        this.player.dead();
      } else {
        collidedEnemy.dead();
        this.player.enabledSpells = this.player.enabledSpells.concat(collidedEnemy.enabledSpells);
      }
    }

    const creatures = [this.player, ...this.enemies];
    creatures.forEach(creature => {
      const response = new SAT.Response()
      const collidedGround = checkCollided(this.ground, creature, response);

      creature.mayJump = false;
      if (collidedGround && response.overlap > 0) {
        if (collidedGround instanceof Ground) {
          creature.pos.y = collidedGround.pos.y - creature.model.h;
          creature.speed.y = 0;
          creature.mayJump = true;
        }

        if (collidedGround instanceof GroundItem) {
          if (response.overlapN.x > 0) {
            creature.pos.x = collidedGround.pos.x - creature.model.w;
          }
          if (response.overlapN.x < 0) {
            creature.pos.x = collidedGround.pos.x + collidedGround.model.w;
          }
          if (response.overlapN.y > 0) {
            creature.pos.y = collidedGround.pos.y - creature.model.h;
            creature.speed.y = 0;
            creature.mayJump = true;
          }
          if (response.overlapN.y < 0) {
            creature.speed.y = 0;
            creature.pos.y = collidedGround.pos.y + collidedGround.model.h;
          }
        }
      }
    })

    this.enemies.forEach(enemy => {
      const response = new SAT.Response()
      const collidedWithEnemyFire = checkCollided(this.player.children, enemy, response);

      if (collidedWithEnemyFire instanceof Spell) {
        collidedWithEnemyFire.collide(enemy, this.player);
      }

      const collidedWithPlayerFire = checkCollided(enemy.children, this.player, response)

      if (collidedWithPlayerFire instanceof Spell) {
        collidedWithPlayerFire.collide(this.player, this.enemies[0]);
      }
    })

  }

  fill() {
    const {player, ground, enemies} = this;
    this.screen.addElements([player, ...ground, ...enemies], player.pos);
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
    if (key.isDown(Key.ONE)) {
      this.player.spell(spell.BOLT);
    }
    if (key.isDown(Key.TWO)) {
      this.player.spell(spell.TELEPORT);
    }
    if (key.isDown(Key.THREE)) {
      this.player.spell(spell.FREEZE);
    }
    if (key.isDown(Key.FOUR)) {
      this.player.spell(spell.KICK);
    }
    if (key.isDown(Key.FIVE)) {
      this.player.spell(spell.FIRE);
    }
  }

  attachEvents() {
    document.addEventListener('keydown', (e) => key.onKeydown(e), false)
    document.addEventListener('keyup', (e) => key.onKeyup(e), false)
  }
}
