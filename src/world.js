import Player from './player.js';
import {Ground, GroundItem} from './ground.js';
import Enemy from './enemy.js';
import Sat from 'sat';
import Key from './key';

const key = new Key();

export default class World {
  constructor(screen) {
    this.screen = screen;
    this.init();
    this.addCreatures();
    this.attachEvents();
    this.update();
    this._spendTime = 0;
  }

  addCreatures() {
    this.player = new Player();
    this.ground = [new Ground(), new GroundItem(200, 300, 100, 30)];
    this.enemies = [new Enemy(300, 350), new Enemy(350, 350)];
  }

  init() {
  }

  update(time = 0) {
    const tick = (time - this.spendTime) / 1000;
    this.spendTime = time;

    this.collision(tick);
    this.checkKeys();
    this.fill();
    requestAnimationFrame(this.update.bind(this));
  }

  collision(tick) {
    const response = new SAT.Response();  
    const collided = this.enemies.some(enemy => {
      return SAT.testPolygonPolygon(this.player.model.toPolygon(), enemy.model.toPolygon(), response);
    }) 
    if (collided) {
      this.enemy.collide(this.player, response);
      this.player.collide(this.enemy, response);
    }

    let collidedGround;
    const playerOnGround = this.ground.some(ground => {
       const collided = SAT.testPolygonPolygon(this.player.model.toPolygon(), ground.model.toPolygon(), response);
       if (collided) {
        collidedGround = ground;
       }
       return collided;
    });

    this.player.gravity(tick);
    
    if (playerOnGround) {
      this.player.collide(collidedGround, response);
    }
  }

  fill() {
    ctx.fillStyle = '#abd5fc';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    this.player.fill();
    this.ground.forEach(ground => ground.fill());
    this.enemies.forEach(ground => ground.fill());;
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
