import SAT from 'sat';

const GROUND_POS = 100;

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

class Enemy extends WorldObject {
  constructor() {
    super(400, 350, 20, 50, 'black');
  }
  dead() {
    this.pos.x = -100000
  }
  collide(obj, res) {
    if (obj instanceof Player) {
      if (Math.abs(res.overlapN.y) > 0) {
        this.dead();
      }
    }
  }
}

class Player extends WorldObject {
  constructor() {
    super(100, 350, 20, 50, 'white');
  }
  move(dir) {
    switch (dir) {
      case 'forward':
        this.right(10);
        break;
      case 'back':
        this.left(10);
        break;
    }
  }
  dead() {
    this.pos.x = -100000
  }
  collide(obj, res) {
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
  }

  addCreatures() {
    this.player = new Player();
    this.ground = new Ground();
    this.enemy = new Enemy();
  }

  init() {
  }

  update() {
    this.fill();
    this.collision();
    requestAnimationFrame(this.update.bind(this));
  }

  collision() {
    const response = new SAT.Response();  
    const collided = SAT.testPolygonPolygon(this.player.model.toPolygon(), this.enemy.model.toPolygon(), response);
    if (collided) {
      this.enemy.collide(this.player, response);
      this.player.collide(this.enemy, response);
    }
  }

  fill() {
    ctx.fillStyle = '#abd5fc';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    this.player.fill();
    this.ground.fill();
    this.enemy.fill();
  }

  attachEvents() {
    document.addEventListener('keydown', function(e) {
      switch(e.code) {
        case 'KeyD':
          this.player.move('forward');
          break;
        case 'KeyA':
          this.player.move('back')
          break;
      }
    }.bind(this))
  }
}

new World();