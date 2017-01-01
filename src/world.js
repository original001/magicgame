import WorldObject from './base.js';
import Player from './player.js';
import {Ground, GroundItem} from './ground.js';
import Enemy from './enemy.js';
import SAT from 'sat';
import Key from './key';

const key = new Key();

export default class World {
  constructor(screen) {
    this.world = new WorldObject(0, 0, canvas.offsetWidth, canvas.offsetHeight, '#abd5fc')
    this.screen = screen;
    this._spendTime = 0;

    this.init();
    this.addCreatures();
    this.attachEvents();
    this.update();
  }

  addCreatures() {
    this.player = new Player();
    this.ground = [new Ground(), new GroundItem(200, 300, 100, 30)];
    this.enemies = [new Enemy(300, 350), new Enemy(350, 350)];
  }

  init() {
  }

  update(time = 0) {
    const tick = (time - this._spendTime) / 1000;
    this._spendTime = time;

    this.collision(tick);
    this.checkKeys();
    this.fill();
    requestAnimationFrame(this.update.bind(this));
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
      }
    }

    const creatures = [this.player, ...this.enemies];
    creatures.forEach(creature => {
      let collidedGround;
      const playerOnGround = this.ground.some(ground => {
         const collided = SAT.testPolygonPolygon(creature.model.toPolygon(), ground.model.toPolygon(), response);
         if (collided) {
          collidedGround = ground;
         }
         return collided;
      });

      creature.gravity(tick);

      if (playerOnGround) {
        if (collidedGround instanceof Ground) {
          creature.pos.y = collidedGround.pos.y - creature.model.h;
          creature.speed = 0;
        }

        if (collidedGround instanceof GroundItem) {
          if (response.overlapN.x > 0) {
            creature.pos.x = collidedGround.pos.x - creature.model.w;
          }
        }
      }
    })

  }

  fill() {
    const {player, ground, enemies, world} = this;
    this.screen.addElements([world, player, ...ground, ...enemies]);
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
  }

  attachEvents() {
    document.addEventListener('keydown', (e) => key.onKeydown(e), false)
    document.addEventListener('keyup', (e) => key.onKeyup(e), false)
  }
}
