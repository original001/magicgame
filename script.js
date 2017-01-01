const getRandom = (min, max) => {
  var random = Math.random();
  return random * (max - min) + min;
}

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y
  }
}

class Enemy {
  constructor(x, y) {
    this.pos = new Vec(x, y);
  }
}

class Player {
  constructor() {
    this.pos = new Vec(200, 200);
  }
}

class Spell {
  constructor() {
    this.activate();
  }
  activate() {
    if (this.active) return;
    this.active = true;

    var actions = ['ArrowRight', 'ArrowLeft'];
    console.log(actions);
    var successActions = 0;

    actions.forEach(action => {
      document.addEventListener('keydown', function(e) {
        e.preventDefault();
        if (e.code === action) {
          successActions++;
        }

        if (successActions = actions.length) {
          console.log('spell')
        }
      })
    })
  }
}

class World {
  constructor() {
    this.init();
    this.addCreatures();
    this.fill();
    this.attachEvents();
  }

  addCreatures() {
    this.player = new Player();
    this.enemies = [];

    for (var i = 0; i < 10; i++) {
      this.enemies[i] = new Enemy(getRandom(20, 380), getRandom(20, 380));
    }
  }

  init() {
    var canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
  }

  fill() {
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    this.enemies.forEach(enemy => {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(enemy.pos.x, enemy.pos.y, 10, 10);
    })

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(this.player.pos.x, this.player.pos.y, 20, 20);
  }

  attachEvents() {
    document.addEventListener('keydown', function(e) {
      e.preventDefault();
      switch(e.code) {
        case 'Enter':
          new Spell();
      }
    })
  }
}

new World();