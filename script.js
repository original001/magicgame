import SAT from 'sat';
import Key from './src/key.js';

const GROUND_POS = 100;
const log = console.log;
const key = new Key;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

const getRandom = (min, max) => {
  var random = Math.random();
  return random * (max - min) + min;
}

const fillRect = (pos, size, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(pos.x, pos.y, size.w, size.h);
}

class WorldObject {
  constructor(x, y, w, h, color) {
    this.pos = new SAT.Vector(x, y);
    this.model = new SAT.Box(this.pos, w, h);
    this.color = color || '#ddd';
  }
  right(to) {
    this.pos.x += to;  
  }
  left(to) {
    this.pos.x -= to;
  }
  fill() {
    const {pos, model, color} = this;
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, model.w, model.h);
  }
}

class GravityObject extends WorldObject {
  speed = 0;

  gravity(tick) {
    this.pos.y = this.pos.y - this.speed * tick + 4.9 * tick * tick; 
    this.speed -= 9.8;
  }

  jump(speed) {
    if (this.speed !== 0) return;
    log(`speed ${speed}`)
    this.speed = speed;
    this.pos.y -= 1
  }

  collide(obj, res) {
    if (obj instanceof Ground) {
      this.pos.y = obj.pos.y - this.model.h;
      this.speed = 0;
    }
  }
}

class Enemy extends GravityObject {
  constructor() {
    super(400, 350, 20, 50, 'black');
  }
  dead() {
    this.pos.x = -100000
  }
  collide(obj, res) {
    super.collide(obj, res);
    if (obj instanceof Player) {
      if (Math.abs(res.overlapN.y) > 0) {
        this.dead();
      }
    }
  }
}

class Player extends GravityObject {
  constructor() {
    super(100, 350, 20, 50, 'white');
  }
  move(dir) {
    switch (dir) {
      case 'forward':
        this.right(5);
        break;
      case 'back':
        this.left(5);
        break;
      case 'up':
        this.jump(400);
        break;
    }
  }
  dead() {
    this.pos.x = -100000
  }
  collide(obj, res) {
    super.collide(obj, res);
    if (obj instanceof Enemy) {
      if (Math.abs(res.overlapN.x) > 0) {
        this.dead();
      }
    }
  }
}

class Ground extends WorldObject {
  constructor() {
    super(0, canvas.offsetHeight - 100, canvas.offsetWidth, 100, '#ddd');
  }
}

class World {
  constructor() {
    this.init();
    this.addCreatures();
    this.fill();
    this.attachEvents();
    this.update();
    this._spendTime = 0;
  }

  addCreatures() {
    this.player = new Player();
    this.ground = new Ground();
    this.enemy = new Enemy();
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
    const collided = SAT.testPolygonPolygon(this.player.model.toPolygon(), this.enemy.model.toPolygon(), response);
    if (collided) {
      this.enemy.collide(this.player, response);
      this.player.collide(this.enemy, response);
    }
    const playerOnGround = SAT.testPolygonPolygon(this.player.model.toPolygon(), this.ground.model.toPolygon(), response);
    if (!playerOnGround) {
      this.player.gravity(tick);
    } else {
      this.player.collide(this.ground, response);
    }

    const enemyOnGround = SAT.testPolygonPolygon(this.enemy.model.toPolygon(), this.ground.model.toPolygon(), response);
    if (!enemyOnGround) {
      this.enemy.gravity();
    } else {
      this.enemy.collide(this.ground, response);
    }
  }

  fill() {
    ctx.fillStyle = '#abd5fc';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    this.player.fill();
    this.ground.fill();
    this.enemy.fill();
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

new World();