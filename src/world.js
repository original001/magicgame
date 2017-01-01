import WorldObject from './base.js';
import Player from './player.js';
import {Ground, GroundItem} from './ground.js';
import Enemy, {MagicEnemy} from './enemy.js';
import SAT from 'sat';
import Key from './key';
import * as Spell from './spell.js';

const key = new Key();

export default class World {
  constructor(screen) {
    this.world = new WorldObject(0, 0, canvas.offsetWidth, canvas.offsetHeight, '#abd5fc')
    this.screen = screen;
    this._spendTime = 0;

    this.addCreatures();
    this.attachEvents();
    this.update();
  }

  addCreatures() {
    this.player = new Player();
    this.ground = [new Ground(), new GroundItem(200, 320, 100, 20)];
    this.enemies = [new MagicEnemy(300, 370, Spell.BOLT), new Enemy(370, 350)];
    this.enemyFire = [];
    this.friendlyFire = [];
  }

  update(time = 0) {
    const tick = (time - this._spendTime) / 1000;
    this._spendTime = time;

    this.updateBounds(tick);
    this.checkKeys();
    this.collision(tick);
    this.moveEnemies(tick);
    this.fill();
    requestAnimationFrame(this.update.bind(this));
  }

  updateBounds(tick) {
    this.enemyFire.forEach(obj => obj.update(tick));
    this.friendlyFire.forEach(obj => obj.update(tick));
  }

  moveEnemies(tick) {
    this.enemies.forEach(enemy => {
      this.makeSpell(Spell.BOLT, enemy);
      if (this.player.pos.x > enemy.pos.x) {
        enemy.right(tick * 100);
      } else {
        enemy.left(tick * 100);
      }
    });
  }

  collision(tick) {
    const response = new SAT.Response();  
    let collidedEnemy;
    const collidedWithEnemy = this.enemies.some(enemy => {
      const collided = SAT.testPolygonPolygon(this.player.model.toPolygon(), enemy.model.toPolygon(), response);
      if (collided) {
        collidedEnemy = enemy;
      }
      return collided;
    }) 

    if (collidedWithEnemy) {
      if (Math.abs(response.overlapN.x) > 0) {
        this.player.dead();
      } else {
        collidedEnemy.dead();
        this.player.enabledSpells = this.player.enabledSpells.concat(collidedEnemy.enabledSpells);
      }
    }

    const creatures = [this.player, ...this.enemies];
    creatures.forEach(creature => {
      let collidedGround;
      let response = new SAT.Response()
      const playerOnGround = this.ground.some(ground => {
         const collided = SAT.testPolygonPolygon(creature.model.toPolygon(), ground.model.toPolygon(), response);
         if (collided) {
          collidedGround = ground;
         }
         return collided;
      });

      creature.gravity(tick);

      if (playerOnGround && response.overlap > 0) {
        if (collidedGround instanceof Ground) {
          creature.pos.y = collidedGround.pos.y - creature.model.h;
          creature.speed = 0;
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
            creature.speed = 0;
          }
          if (response.overlapN.y < 0) {
            creature.speed = -1;
            creature.pos.y = collidedGround.pos.y + collidedGround.model.h;
          }
        }
      }
    })

    this.enemies.forEach(enemy => {
      let collidedFire;
      const collidedEnemy = this.friendlyFire.some(fire => {
         const collided = SAT.testPolygonPolygon(enemy.model.toPolygon(), fire.model.toPolygon(), response);
         if (collided) {
          collidedFire = fire;
         }
         return collided;
      });

      if (collidedEnemy) {
        collidedFire.collide(enemy, this.player);
      }
    })

  }

  fill() {
    const {player, ground, enemies, world, friendlyFire, enemyFire} = this;
    this.screen.addElements([world, player, ...ground, ...enemies, ...friendlyFire, ...enemyFire]);
  }

  makeSpell(spelltype, source) {
    const spell = Spell.createSpell(source, spelltype);
    const to = source === this.player ? this.friendlyFire : this.enemyFire;
    spell && to.push(spell);
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
      this.makeSpell(Spell.BOLT, this.player);
    }
    if (key.isDown(Key.TWO)) {
      const spell = Spell.createSpell(this.player, Spell.TELEPORT);
      spell && this.friendlyFire.push(spell);
    }
    if (key.isDown(Key.THREE)) {
      const spell = Spell.createSpell(this.player, Spell.FREEZE);
      spell && this.friendlyFire.push(spell);
    }
    if (key.isDown(Key.FOUR)) {
      const spell = Spell.createSpell(this.player, Spell.KICK);
      spell && this.friendlyFire.push(spell);
    }
    if (key.isDown(Key.FIVE)) {
      const spell = Spell.createSpell(this.player, Spell.FIRE);
      spell && this.friendlyFire.push(spell);
    }
  }

  attachEvents() {
    document.addEventListener('keydown', (e) => key.onKeydown(e), false)
    document.addEventListener('keyup', (e) => key.onKeyup(e), false)
  }
}
