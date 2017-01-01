/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _world = __webpack_require__(2);

	var _world2 = _interopRequireDefault(_world);

	var _screen = __webpack_require__(11);

	var _screen2 = _interopRequireDefault(_screen);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var screen = new _screen2.default(document.getElementById('canvas'));

	new _world2.default(screen);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(3);

	var _base2 = _interopRequireDefault(_base);

	var _player = __webpack_require__(4);

	var _player2 = _interopRequireDefault(_player);

	var _ground = __webpack_require__(5);

	var _enemy = __webpack_require__(6);

	var _enemy2 = _interopRequireDefault(_enemy);

	var _sat = __webpack_require__(7);

	var _sat2 = _interopRequireDefault(_sat);

	var _key = __webpack_require__(10);

	var _key2 = _interopRequireDefault(_key);

	var _spell = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./spell.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _spell2 = _interopRequireDefault(_spell);

	var _fire = __webpack_require__(15);

	var _fire2 = _interopRequireDefault(_fire);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var spell = new _spell2.default();
	var key = new _key2.default();

	var World = function () {
	  function World(screen) {
	    _classCallCheck(this, World);

	    this.world = new _base2.default(0, 0, canvas.offsetWidth, canvas.offsetHeight, '#abd5fc');
	    this.screen = screen;
	    this._spendTime = 0;

	    this.init();
	    this.addCreatures();
	    this.attachEvents();
	    this.update();
	  }

	  _createClass(World, [{
	    key: 'addCreatures',
	    value: function addCreatures() {
	      this.player = new _player2.default();
	      this.ground = [new _ground.Ground(), new _ground.GroundItem(200, 320, 100, 20)];
	      this.enemies = [new _enemy2.default(300, 350), new _enemy2.default(350, 350)];
	      this.enemyFire = [];
	      this.friendlyFire = [];
	    }
	  }, {
	    key: 'init',
	    value: function init() {}
	  }, {
	    key: 'update',
	    value: function update() {
	      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	      var tick = (time - this._spendTime) / 1000;
	      this._spendTime = time;

	      this.updateBounds(tick);
	      this.checkKeys();
	      this.collision(tick);
	      this.moveEnemies(tick);
	      this.fill();
	      requestAnimationFrame(this.update.bind(this));
	    }
	  }, {
	    key: 'updateBounds',
	    value: function updateBounds(tick) {
	      this.enemyFire.forEach(function (obj) {
	        return obj.update(tick);
	      });
	      this.friendlyFire.forEach(function (obj) {
	        return obj.update(tick);
	      });
	    }
	  }, {
	    key: 'moveEnemies',
	    value: function moveEnemies(tick) {
	      var _this = this;

	      this.enemies.forEach(function (enemy) {
	        if (_this.player.pos.x > enemy.pos.x) {
	          enemy.right(tick * 100);
	        } else {
	          enemy.left(tick * 100);
	        }
	      });
	    }
	  }, {
	    key: 'collision',
	    value: function collision(tick) {
	      var _this2 = this;

	      var response = new _sat2.default.Response();
	      var collidedEnemy = void 0;
	      var collidedWithEnemy = this.enemies.some(function (enemy) {
	        var collided = _sat2.default.testPolygonPolygon(_this2.player.model.toPolygon(), enemy.model.toPolygon(), response);
	        if (collided) {
	          collidedEnemy = enemy;
	        }
	        return collided;
	      });

	      if (collidedWithEnemy) {
	        if (Math.abs(response.overlapN.x) > 0) {
	          this.player.dead();
	        } else {
	          collidedEnemy.dead();
	        }
	      }

	      var creatures = [this.player].concat(_toConsumableArray(this.enemies));
	      creatures.forEach(function (creature) {
	        var collidedGround = void 0;
	        var response = new _sat2.default.Response();
	        var playerOnGround = _this2.ground.some(function (ground) {
	          var collided = _sat2.default.testPolygonPolygon(creature.model.toPolygon(), ground.model.toPolygon(), response);
	          if (collided) {
	            collidedGround = ground;
	          }
	          return collided;
	        });

	        creature.gravity(tick);

	        if (playerOnGround && response.overlap > 0) {
	          if (collidedGround instanceof _ground.Ground) {
	            creature.pos.y = collidedGround.pos.y - creature.model.h;
	            creature.speed = 0;
	          }

	          if (collidedGround instanceof _ground.GroundItem) {
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
	      });

	      this.enemies.forEach(function (enemy) {
	        var collidedFire = void 0;
	        var collidedEnemy = _this2.friendlyFire.some(function (fire) {
	          var collided = _sat2.default.testPolygonPolygon(enemy.model.toPolygon(), fire.model.toPolygon(), response);
	          if (collided) {
	            collidedFire = fire;
	          }
	          return collided;
	        });

	        if (collidedEnemy) {
	          collidedFire.collide(enemy, _this2.player);
	        }
	      });
	    }
	  }, {
	    key: 'fill',
	    value: function fill() {
	      var player = this.player,
	          ground = this.ground,
	          enemies = this.enemies,
	          world = this.world,
	          friendlyFire = this.friendlyFire,
	          enemyFire = this.enemyFire;

	      this.screen.addElements([world, player].concat(_toConsumableArray(ground), _toConsumableArray(enemies), _toConsumableArray(friendlyFire), _toConsumableArray(enemyFire)));
	    }
	  }, {
	    key: 'checkKeys',
	    value: function checkKeys() {
	      if (key.isDown(_key2.default.RIGHT)) {
	        this.player.move('forward');
	      }
	      if (key.isDown(_key2.default.LEFT)) {
	        this.player.move('back');
	      }
	      if (key.isDown(_key2.default.UP)) {
	        this.player.move('up');
	      }
	      if (key.isDown(_key2.default.ONE)) {
	        // this.player.spell('one');
	        // spell.onSpell(Spell.BOLT);
	        var ball = new _fire2.default(this.player.pos.x + this.player.model.w, this.player.pos.y + 10, 5, 5, 'blue');
	        ball.update = function (tick) {
	          this.pos.x += tick * 1000;
	        };
	        ball.collide = function (target) {
	          target.dead();
	        };
	        this.friendlyFire.push(ball);
	      }
	      if (key.isDown(_key2.default.TWO)) {
	        var _ball = new _fire2.default(this.player.pos.x + this.player.model.w, this.player.pos.y + 10, 5, 5, 'purple');
	        _ball.update = function (tick) {
	          this.pos.x += tick * 100;
	        };
	        _ball.collide = function (target, player) {
	          var targetPos = target.pos.x;
	          target.pos.x = player.pos.x;
	          player.pos.x = targetPos;
	        };
	        this.friendlyFire.push(_ball);
	      }
	      if (key.isDown(_key2.default.THREE)) {
	        var _ball2 = new _fire2.default(this.player.pos.x + this.player.model.w, this.player.pos.y + 10, 5, 5, 'green');
	        _ball2.update = function (tick) {
	          this.pos.x += tick * 100;
	        };
	        _ball2.collide = function (target) {
	          target.freeze();
	        };
	        this.friendlyFire.push(_ball2);
	      }

	      if (key.isDown(key.FOUR)) {}
	    }
	  }, {
	    key: 'attachEvents',
	    value: function attachEvents() {
	      document.addEventListener('keydown', function (e) {
	        return key.onKeydown(e);
	      }, false);
	      document.addEventListener('keyup', function (e) {
	        return key.onKeyup(e);
	      }, false);
	    }
	  }]);

	  return World;
	}();

	exports.default = World;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _sat = __webpack_require__(7);

	var _sat2 = _interopRequireDefault(_sat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WorldObject = function WorldObject(x, y, w, h, color) {
	  _classCallCheck(this, WorldObject);

	  this.pos = new _sat2.default.Vector(x, y);
	  this.model = new _sat2.default.Box(this.pos, w, h);
	  this.color = color || '#ddd';
	};

	exports.default = WorldObject;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _gravity = __webpack_require__(12);

	var _gravity2 = _interopRequireDefault(_gravity);

	var _base = __webpack_require__(3);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Player = function (_GravityObject) {
	  _inherits(Player, _GravityObject);

	  function Player() {
	    _classCallCheck(this, Player);

	    return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, 100, 350, 20, 30, 'white'));
	  }

	  _createClass(Player, [{
	    key: 'move',
	    value: function move(dir) {
	      switch (dir) {
	        case 'forward':
	          this.right(5.1);
	          break;
	        case 'back':
	          this.left(5.1);
	          break;
	        case 'up':
	          this.jump(300);
	          break;
	      }
	    }
	  }, {
	    key: 'spell',
	    value: function spell(_spell) {
	      switch (_spell) {
	        case 'one':
	          var ball = new _base2.default(this.pos.x, this.pos.y, 5, 5, 'blue');
	      }
	    }
	  }, {
	    key: 'dead',
	    value: function dead() {
	      this.pos.x = -100000;
	    }
	  }]);

	  return Player;
	}(_gravity2.default);

	exports.default = Player;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.GroundItem = exports.Ground = undefined;

	var _base = __webpack_require__(3);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Ground = exports.Ground = function (_WorldObject) {
	  _inherits(Ground, _WorldObject);

	  function Ground() {
	    _classCallCheck(this, Ground);

	    return _possibleConstructorReturn(this, (Ground.__proto__ || Object.getPrototypeOf(Ground)).call(this, 0, canvas.offsetHeight - 100, canvas.offsetWidth, 100, '#ddd'));
	  }

	  return Ground;
	}(_base2.default);

	var GroundItem = exports.GroundItem = function (_WorldObject2) {
	  _inherits(GroundItem, _WorldObject2);

	  function GroundItem(x, y, w, h) {
	    _classCallCheck(this, GroundItem);

	    return _possibleConstructorReturn(this, (GroundItem.__proto__ || Object.getPrototypeOf(GroundItem)).call(this, x, y, w, h, '#ddd'));
	  }

	  return GroundItem;
	}(_base2.default);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _gravity = __webpack_require__(12);

	var _gravity2 = _interopRequireDefault(_gravity);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Enemy = function (_GravityObject) {
	  _inherits(Enemy, _GravityObject);

	  function Enemy(x, y) {
	    _classCallCheck(this, Enemy);

	    return _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, x, y, 20, 30, 'black'));
	  }

	  _createClass(Enemy, [{
	    key: 'dead',
	    value: function dead() {
	      this.pos.x = -100000;
	    }
	  }]);

	  return Enemy;
	}(_gravity2.default);

	exports.default = Enemy;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// Version 0.6.0 - Copyright 2012 - 2016 -  Jim Riecken <jimr@jimr.ca>
	//
	// Released under the MIT License - https://github.com/jriecken/sat-js
	//
	// A simple library for determining intersections of circles and
	// polygons using the Separating Axis Theorem.
	/** @preserve SAT.js - Version 0.6.0 - Copyright 2012 - 2016 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

	/*global define: false, module: false*/
	/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true, 
	  eqeqeq:true, bitwise:true, strict:true, undef:true, 
	  curly:true, browser:true */

	// Create a UMD wrapper for SAT. Works in:
	//
	//  - Plain browser via global SAT variable
	//  - AMD loader (like require.js)
	//  - Node.js
	//
	// The quoted properties all over the place are used so that the Closure Compiler
	// does not mangle the exposed API in advanced mode.
	/**
	 * @param {*} root - The global scope
	 * @param {Function} factory - Factory that creates SAT module
	 */
	(function (root, factory) {
	  "use strict";

	  if ("function" === 'function' && __webpack_require__(9)['amd']) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (( false ? 'undefined' : _typeof(exports)) === 'object') {
	    module['exports'] = factory();
	  } else {
	    root['SAT'] = factory();
	  }
	})(undefined, function () {
	  "use strict";

	  var SAT = {};

	  //
	  // ## Vector
	  //
	  // Represents a vector in two dimensions with `x` and `y` properties.


	  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
	  // a coordinate is not specified, it will be set to `0`
	  /** 
	   * @param {?number=} x The x position.
	   * @param {?number=} y The y position.
	   * @constructor
	   */
	  function Vector(x, y) {
	    this['x'] = x || 0;
	    this['y'] = y || 0;
	  }
	  SAT['Vector'] = Vector;
	  // Alias `Vector` as `V`
	  SAT['V'] = Vector;

	  // Copy the values of another Vector into this one.
	  /**
	   * @param {Vector} other The other Vector.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['copy'] = Vector.prototype.copy = function (other) {
	    this['x'] = other['x'];
	    this['y'] = other['y'];
	    return this;
	  };

	  // Create a new vector with the same coordinates as this on.
	  /**
	   * @return {Vector} The new cloned vector
	   */
	  Vector.prototype['clone'] = Vector.prototype.clone = function () {
	    return new Vector(this['x'], this['y']);
	  };

	  // Change this vector to be perpendicular to what it was before. (Effectively
	  // roatates it 90 degrees in a clockwise direction)
	  /**
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['perp'] = Vector.prototype.perp = function () {
	    var x = this['x'];
	    this['x'] = this['y'];
	    this['y'] = -x;
	    return this;
	  };

	  // Rotate this vector (counter-clockwise) by the specified angle (in radians).
	  /**
	   * @param {number} angle The angle to rotate (in radians)
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
	    var x = this['x'];
	    var y = this['y'];
	    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
	    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
	    return this;
	  };

	  // Reverse this vector.
	  /**
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['reverse'] = Vector.prototype.reverse = function () {
	    this['x'] = -this['x'];
	    this['y'] = -this['y'];
	    return this;
	  };

	  // Normalize this vector.  (make it have length of `1`)
	  /**
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['normalize'] = Vector.prototype.normalize = function () {
	    var d = this.len();
	    if (d > 0) {
	      this['x'] = this['x'] / d;
	      this['y'] = this['y'] / d;
	    }
	    return this;
	  };

	  // Add another vector to this one.
	  /**
	   * @param {Vector} other The other Vector.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['add'] = Vector.prototype.add = function (other) {
	    this['x'] += other['x'];
	    this['y'] += other['y'];
	    return this;
	  };

	  // Subtract another vector from this one.
	  /**
	   * @param {Vector} other The other Vector.
	   * @return {Vector} This for chaiing.
	   */
	  Vector.prototype['sub'] = Vector.prototype.sub = function (other) {
	    this['x'] -= other['x'];
	    this['y'] -= other['y'];
	    return this;
	  };

	  // Scale this vector. An independant scaling factor can be provided
	  // for each axis, or a single scaling factor that will scale both `x` and `y`.
	  /**
	   * @param {number} x The scaling factor in the x direction.
	   * @param {?number=} y The scaling factor in the y direction.  If this
	   *   is not specified, the x scaling factor will be used.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['scale'] = Vector.prototype.scale = function (x, y) {
	    this['x'] *= x;
	    this['y'] *= y || x;
	    return this;
	  };

	  // Project this vector on to another vector.
	  /**
	   * @param {Vector} other The vector to project onto.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['project'] = Vector.prototype.project = function (other) {
	    var amt = this.dot(other) / other.len2();
	    this['x'] = amt * other['x'];
	    this['y'] = amt * other['y'];
	    return this;
	  };

	  // Project this vector onto a vector of unit length. This is slightly more efficient
	  // than `project` when dealing with unit vectors.
	  /**
	   * @param {Vector} other The unit vector to project onto.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['projectN'] = Vector.prototype.projectN = function (other) {
	    var amt = this.dot(other);
	    this['x'] = amt * other['x'];
	    this['y'] = amt * other['y'];
	    return this;
	  };

	  // Reflect this vector on an arbitrary axis.
	  /**
	   * @param {Vector} axis The vector representing the axis.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['reflect'] = Vector.prototype.reflect = function (axis) {
	    var x = this['x'];
	    var y = this['y'];
	    this.project(axis).scale(2);
	    this['x'] -= x;
	    this['y'] -= y;
	    return this;
	  };

	  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
	  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
	  /**
	   * @param {Vector} axis The unit vector representing the axis.
	   * @return {Vector} This for chaining.
	   */
	  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function (axis) {
	    var x = this['x'];
	    var y = this['y'];
	    this.projectN(axis).scale(2);
	    this['x'] -= x;
	    this['y'] -= y;
	    return this;
	  };

	  // Get the dot product of this vector and another.
	  /**
	   * @param {Vector}  other The vector to dot this one against.
	   * @return {number} The dot product.
	   */
	  Vector.prototype['dot'] = Vector.prototype.dot = function (other) {
	    return this['x'] * other['x'] + this['y'] * other['y'];
	  };

	  // Get the squared length of this vector.
	  /**
	   * @return {number} The length^2 of this vector.
	   */
	  Vector.prototype['len2'] = Vector.prototype.len2 = function () {
	    return this.dot(this);
	  };

	  // Get the length of this vector.
	  /**
	   * @return {number} The length of this vector.
	   */
	  Vector.prototype['len'] = Vector.prototype.len = function () {
	    return Math.sqrt(this.len2());
	  };

	  // ## Circle
	  //
	  // Represents a circle with a position and a radius.

	  // Create a new circle, optionally passing in a position and/or radius. If no position
	  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
	  // have a radius of `0`.
	  /**
	   * @param {Vector=} pos A vector representing the position of the center of the circle
	   * @param {?number=} r The radius of the circle
	   * @constructor
	   */
	  function Circle(pos, r) {
	    this['pos'] = pos || new Vector();
	    this['r'] = r || 0;
	  }
	  SAT['Circle'] = Circle;

	  // Compute the axis-aligned bounding box (AABB) of this Circle.
	  //
	  // Note: Returns a _new_ `Polygon` each time you call this.
	  /**
	   * @return {Polygon} The AABB
	   */
	  Circle.prototype['getAABB'] = Circle.prototype.getAABB = function () {
	    var r = this['r'];
	    var corner = this["pos"].clone().sub(new Vector(r, r));
	    return new Box(corner, r * 2, r * 2).toPolygon();
	  };

	  // ## Polygon
	  //
	  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
	  //
	  // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
	  // provided setters. Otherwise the calculated properties will not be updated correctly.
	  //
	  // `pos` can be changed directly.

	  // Create a new polygon, passing in a position vector, and an array of points (represented
	  // by vectors relative to the position vector). If no position is passed in, the position
	  // of the polygon will be `(0,0)`.
	  /**
	   * @param {Vector=} pos A vector representing the origin of the polygon. (all other
	   *   points are relative to this one)
	   * @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
	   *   in counter-clockwise order.
	   * @constructor
	   */
	  function Polygon(pos, points) {
	    this['pos'] = pos || new Vector();
	    this['angle'] = 0;
	    this['offset'] = new Vector();
	    this.setPoints(points || []);
	  }
	  SAT['Polygon'] = Polygon;

	  // Set the points of the polygon.
	  //
	  // Note: The points are counter-clockwise *with respect to the coordinate system*.
	  // If you directly draw the points on a screen that has the origin at the top-left corner
	  // it will _appear_ visually that the points are being specified clockwise. This is just
	  // because of the inversion of the Y-axis when being displayed.
	  /**
	   * @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
	   *   in counter-clockwise order.
	   * @return {Polygon} This for chaining.
	   */
	  Polygon.prototype['setPoints'] = Polygon.prototype.setPoints = function (points) {
	    // Only re-allocate if this is a new polygon or the number of points has changed.
	    var lengthChanged = !this['points'] || this['points'].length !== points.length;
	    if (lengthChanged) {
	      var i;
	      var calcPoints = this['calcPoints'] = [];
	      var edges = this['edges'] = [];
	      var normals = this['normals'] = [];
	      // Allocate the vector arrays for the calculated properties
	      for (i = 0; i < points.length; i++) {
	        calcPoints.push(new Vector());
	        edges.push(new Vector());
	        normals.push(new Vector());
	      }
	    }
	    this['points'] = points;
	    this._recalc();
	    return this;
	  };

	  // Set the current rotation angle of the polygon.
	  /**
	   * @param {number} angle The current rotation angle (in radians).
	   * @return {Polygon} This for chaining.
	   */
	  Polygon.prototype['setAngle'] = Polygon.prototype.setAngle = function (angle) {
	    this['angle'] = angle;
	    this._recalc();
	    return this;
	  };

	  // Set the current offset to apply to the `points` before applying the `angle` rotation.
	  /**
	   * @param {Vector} offset The new offset vector.
	   * @return {Polygon} This for chaining.
	   */
	  Polygon.prototype['setOffset'] = Polygon.prototype.setOffset = function (offset) {
	    this['offset'] = offset;
	    this._recalc();
	    return this;
	  };

	  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
	  //
	  // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
	  /**
	   * @param {number} angle The angle to rotate (in radians)
	   * @return {Polygon} This for chaining.
	   */
	  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function (angle) {
	    var points = this['points'];
	    var len = points.length;
	    for (var i = 0; i < len; i++) {
	      points[i].rotate(angle);
	    }
	    this._recalc();
	    return this;
	  };

	  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
	  // system* (i.e. `pos`).
	  //
	  // This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
	  // the coordinates of `pos`.
	  //
	  // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
	  /**
	   * @param {number} x The horizontal amount to translate.
	   * @param {number} y The vertical amount to translate.
	   * @return {Polygon} This for chaining.
	   */
	  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
	    var points = this['points'];
	    var len = points.length;
	    for (var i = 0; i < len; i++) {
	      points[i].x += x;
	      points[i].y += y;
	    }
	    this._recalc();
	    return this;
	  };

	  // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
	  // edges and normals of the collision polygon.
	  /**
	   * @return {Polygon} This for chaining.
	   */
	  Polygon.prototype._recalc = function () {
	    // Calculated points - this is what is used for underlying collisions and takes into account
	    // the angle/offset set on the polygon.
	    var calcPoints = this['calcPoints'];
	    // The edges here are the direction of the `n`th edge of the polygon, relative to
	    // the `n`th point. If you want to draw a given edge from the edge value, you must
	    // first translate to the position of the starting point.
	    var edges = this['edges'];
	    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
	    // to the position of the `n`th point. If you want to draw an edge normal, you must first
	    // translate to the position of the starting point.
	    var normals = this['normals'];
	    // Copy the original points array and apply the offset/angle
	    var points = this['points'];
	    var offset = this['offset'];
	    var angle = this['angle'];
	    var len = points.length;
	    var i;
	    for (i = 0; i < len; i++) {
	      var calcPoint = calcPoints[i].copy(points[i]);
	      calcPoint.x += offset.x;
	      calcPoint.y += offset.y;
	      if (angle !== 0) {
	        calcPoint.rotate(angle);
	      }
	    }
	    // Calculate the edges/normals
	    for (i = 0; i < len; i++) {
	      var p1 = calcPoints[i];
	      var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
	      var e = edges[i].copy(p2).sub(p1);
	      normals[i].copy(e).perp().normalize();
	    }
	    return this;
	  };

	  // Compute the axis-aligned bounding box. Any current state
	  // (translations/rotations) will be applied before constructing the AABB.
	  //
	  // Note: Returns a _new_ `Polygon` each time you call this.
	  /**
	   * @return {Polygon} The AABB
	   */
	  Polygon.prototype["getAABB"] = Polygon.prototype.getAABB = function () {
	    var points = this["calcPoints"];
	    var len = points.length;
	    var xMin = points[0]["x"];
	    var yMin = points[0]["y"];
	    var xMax = points[0]["x"];
	    var yMax = points[0]["y"];
	    for (var i = 1; i < len; i++) {
	      var point = points[i];
	      if (point["x"] < xMin) {
	        xMin = point["x"];
	      } else if (point["x"] > xMax) {
	        xMax = point["x"];
	      }
	      if (point["y"] < yMin) {
	        yMin = point["y"];
	      } else if (point["y"] > yMax) {
	        yMax = point["y"];
	      }
	    }
	    return new Box(this["pos"].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin).toPolygon();
	  };

	  // ## Box
	  //
	  // Represents an axis-aligned box, with a width and height.


	  // Create a new box, with the specified position, width, and height. If no position
	  // is given, the position will be `(0,0)`. If no width or height are given, they will
	  // be set to `0`.
	  /**
	   * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
	   * @param {?number=} w The width of the box.
	   * @param {?number=} h The height of the box.
	   * @constructor
	   */
	  function Box(pos, w, h) {
	    this['pos'] = pos || new Vector();
	    this['w'] = w || 0;
	    this['h'] = h || 0;
	  }
	  SAT['Box'] = Box;

	  // Returns a polygon whose edges are the same as this box.
	  /**
	   * @return {Polygon} A new Polygon that represents this box.
	   */
	  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function () {
	    var pos = this['pos'];
	    var w = this['w'];
	    var h = this['h'];
	    return new Polygon(new Vector(pos['x'], pos['y']), [new Vector(), new Vector(w, 0), new Vector(w, h), new Vector(0, h)]);
	  };

	  // ## Response
	  //
	  // An object representing the result of an intersection. Contains:
	  //  - The two objects participating in the intersection
	  //  - The vector representing the minimum change necessary to extract the first object
	  //    from the second one (as well as a unit vector in that direction and the magnitude
	  //    of the overlap)
	  //  - Whether the first object is entirely inside the second, and vice versa.
	  /**
	   * @constructor
	   */
	  function Response() {
	    this['a'] = null;
	    this['b'] = null;
	    this['overlapN'] = new Vector();
	    this['overlapV'] = new Vector();
	    this.clear();
	  }
	  SAT['Response'] = Response;

	  // Set some values of the response back to their defaults.  Call this between tests if
	  // you are going to reuse a single Response object for multiple intersection tests (recommented
	  // as it will avoid allcating extra memory)
	  /**
	   * @return {Response} This for chaining
	   */
	  Response.prototype['clear'] = Response.prototype.clear = function () {
	    this['aInB'] = true;
	    this['bInA'] = true;
	    this['overlap'] = Number.MAX_VALUE;
	    return this;
	  };

	  // ## Object Pools

	  // A pool of `Vector` objects that are used in calculations to avoid
	  // allocating memory.
	  /**
	   * @type {Array.<Vector>}
	   */
	  var T_VECTORS = [];
	  for (var i = 0; i < 10; i++) {
	    T_VECTORS.push(new Vector());
	  }

	  // A pool of arrays of numbers used in calculations to avoid allocating
	  // memory.
	  /**
	   * @type {Array.<Array.<number>>}
	   */
	  var T_ARRAYS = [];
	  for (var i = 0; i < 5; i++) {
	    T_ARRAYS.push([]);
	  }

	  // Temporary response used for polygon hit detection.
	  /**
	   * @type {Response}
	   */
	  var T_RESPONSE = new Response();

	  // Tiny "point" polygon used for polygon hit detection.
	  /**
	   * @type {Polygon}
	   */
	  var TEST_POINT = new Box(new Vector(), 0.000001, 0.000001).toPolygon();

	  // ## Helper Functions

	  // Flattens the specified array of points onto a unit vector axis,
	  // resulting in a one dimensional range of the minimum and
	  // maximum value on that axis.
	  /**
	   * @param {Array.<Vector>} points The points to flatten.
	   * @param {Vector} normal The unit vector axis to flatten on.
	   * @param {Array.<number>} result An array.  After calling this function,
	   *   result[0] will be the minimum value,
	   *   result[1] will be the maximum value.
	   */
	  function flattenPointsOn(points, normal, result) {
	    var min = Number.MAX_VALUE;
	    var max = -Number.MAX_VALUE;
	    var len = points.length;
	    for (var i = 0; i < len; i++) {
	      // The magnitude of the projection of the point onto the normal
	      var dot = points[i].dot(normal);
	      if (dot < min) {
	        min = dot;
	      }
	      if (dot > max) {
	        max = dot;
	      }
	    }
	    result[0] = min;result[1] = max;
	  }

	  // Check whether two convex polygons are separated by the specified
	  // axis (must be a unit vector).
	  /**
	   * @param {Vector} aPos The position of the first polygon.
	   * @param {Vector} bPos The position of the second polygon.
	   * @param {Array.<Vector>} aPoints The points in the first polygon.
	   * @param {Array.<Vector>} bPoints The points in the second polygon.
	   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
	   *   will be projected onto this axis.
	   * @param {Response=} response A Response object (optional) which will be populated
	   *   if the axis is not a separating axis.
	   * @return {boolean} true if it is a separating axis, false otherwise.  If false,
	   *   and a response is passed in, information about how much overlap and
	   *   the direction of the overlap will be populated.
	   */
	  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
	    var rangeA = T_ARRAYS.pop();
	    var rangeB = T_ARRAYS.pop();
	    // The magnitude of the offset between the two polygons
	    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
	    var projectedOffset = offsetV.dot(axis);
	    // Project the polygons onto the axis.
	    flattenPointsOn(aPoints, axis, rangeA);
	    flattenPointsOn(bPoints, axis, rangeB);
	    // Move B's range to its position relative to A.
	    rangeB[0] += projectedOffset;
	    rangeB[1] += projectedOffset;
	    // Check if there is a gap. If there is, this is a separating axis and we can stop
	    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
	      T_VECTORS.push(offsetV);
	      T_ARRAYS.push(rangeA);
	      T_ARRAYS.push(rangeB);
	      return true;
	    }
	    // This is not a separating axis. If we're calculating a response, calculate the overlap.
	    if (response) {
	      var overlap = 0;
	      // A starts further left than B
	      if (rangeA[0] < rangeB[0]) {
	        response['aInB'] = false;
	        // A ends before B does. We have to pull A out of B
	        if (rangeA[1] < rangeB[1]) {
	          overlap = rangeA[1] - rangeB[0];
	          response['bInA'] = false;
	          // B is fully inside A.  Pick the shortest way out.
	        } else {
	          var option1 = rangeA[1] - rangeB[0];
	          var option2 = rangeB[1] - rangeA[0];
	          overlap = option1 < option2 ? option1 : -option2;
	        }
	        // B starts further left than A
	      } else {
	        response['bInA'] = false;
	        // B ends before A ends. We have to push A out of B
	        if (rangeA[1] > rangeB[1]) {
	          overlap = rangeA[0] - rangeB[1];
	          response['aInB'] = false;
	          // A is fully inside B.  Pick the shortest way out.
	        } else {
	          var option1 = rangeA[1] - rangeB[0];
	          var option2 = rangeB[1] - rangeA[0];
	          overlap = option1 < option2 ? option1 : -option2;
	        }
	      }
	      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
	      var absOverlap = Math.abs(overlap);
	      if (absOverlap < response['overlap']) {
	        response['overlap'] = absOverlap;
	        response['overlapN'].copy(axis);
	        if (overlap < 0) {
	          response['overlapN'].reverse();
	        }
	      }
	    }
	    T_VECTORS.push(offsetV);
	    T_ARRAYS.push(rangeA);
	    T_ARRAYS.push(rangeB);
	    return false;
	  }
	  SAT['isSeparatingAxis'] = isSeparatingAxis;

	  // Calculates which Voronoi region a point is on a line segment.
	  // It is assumed that both the line and the point are relative to `(0,0)`
	  //
	  //            |       (0)      |
	  //     (-1)  [S]--------------[E]  (1)
	  //            |       (0)      |
	  /**
	   * @param {Vector} line The line segment.
	   * @param {Vector} point The point.
	   * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,
	   *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
	   *          RIGHT_VORONOI_REGION (1) if it is the right region.
	   */
	  function voronoiRegion(line, point) {
	    var len2 = line.len2();
	    var dp = point.dot(line);
	    // If the point is beyond the start of the line, it is in the
	    // left voronoi region.
	    if (dp < 0) {
	      return LEFT_VORONOI_REGION;
	    }
	    // If the point is beyond the end of the line, it is in the
	    // right voronoi region.
	    else if (dp > len2) {
	        return RIGHT_VORONOI_REGION;
	      }
	      // Otherwise, it's in the middle one.
	      else {
	          return MIDDLE_VORONOI_REGION;
	        }
	  }
	  // Constants for Voronoi regions
	  /**
	   * @const
	   */
	  var LEFT_VORONOI_REGION = -1;
	  /**
	   * @const
	   */
	  var MIDDLE_VORONOI_REGION = 0;
	  /**
	   * @const
	   */
	  var RIGHT_VORONOI_REGION = 1;

	  // ## Collision Tests

	  // Check if a point is inside a circle.
	  /**
	   * @param {Vector} p The point to test.
	   * @param {Circle} c The circle to test.
	   * @return {boolean} true if the point is inside the circle, false if it is not.
	   */
	  function pointInCircle(p, c) {
	    var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']);
	    var radiusSq = c['r'] * c['r'];
	    var distanceSq = differenceV.len2();
	    T_VECTORS.push(differenceV);
	    // If the distance between is smaller than the radius then the point is inside the circle.
	    return distanceSq <= radiusSq;
	  }
	  SAT['pointInCircle'] = pointInCircle;

	  // Check if a point is inside a convex polygon.
	  /**
	   * @param {Vector} p The point to test.
	   * @param {Polygon} poly The polygon to test.
	   * @return {boolean} true if the point is inside the polygon, false if it is not.
	   */
	  function pointInPolygon(p, poly) {
	    TEST_POINT['pos'].copy(p);
	    T_RESPONSE.clear();
	    var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
	    if (result) {
	      result = T_RESPONSE['aInB'];
	    }
	    return result;
	  }
	  SAT['pointInPolygon'] = pointInPolygon;

	  // Check if two circles collide.
	  /**
	   * @param {Circle} a The first circle.
	   * @param {Circle} b The second circle.
	   * @param {Response=} response Response object (optional) that will be populated if
	   *   the circles intersect.
	   * @return {boolean} true if the circles intersect, false if they don't. 
	   */
	  function testCircleCircle(a, b, response) {
	    // Check if the distance between the centers of the two
	    // circles is greater than their combined radius.
	    var differenceV = T_VECTORS.pop().copy(b['pos']).sub(a['pos']);
	    var totalRadius = a['r'] + b['r'];
	    var totalRadiusSq = totalRadius * totalRadius;
	    var distanceSq = differenceV.len2();
	    // If the distance is bigger than the combined radius, they don't intersect.
	    if (distanceSq > totalRadiusSq) {
	      T_VECTORS.push(differenceV);
	      return false;
	    }
	    // They intersect.  If we're calculating a response, calculate the overlap.
	    if (response) {
	      var dist = Math.sqrt(distanceSq);
	      response['a'] = a;
	      response['b'] = b;
	      response['overlap'] = totalRadius - dist;
	      response['overlapN'].copy(differenceV.normalize());
	      response['overlapV'].copy(differenceV).scale(response['overlap']);
	      response['aInB'] = a['r'] <= b['r'] && dist <= b['r'] - a['r'];
	      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
	    }
	    T_VECTORS.push(differenceV);
	    return true;
	  }
	  SAT['testCircleCircle'] = testCircleCircle;

	  // Check if a polygon and a circle collide.
	  /**
	   * @param {Polygon} polygon The polygon.
	   * @param {Circle} circle The circle.
	   * @param {Response=} response Response object (optional) that will be populated if
	   *   they interset.
	   * @return {boolean} true if they intersect, false if they don't.
	   */
	  function testPolygonCircle(polygon, circle, response) {
	    // Get the position of the circle relative to the polygon.
	    var circlePos = T_VECTORS.pop().copy(circle['pos']).sub(polygon['pos']);
	    var radius = circle['r'];
	    var radius2 = radius * radius;
	    var points = polygon['calcPoints'];
	    var len = points.length;
	    var edge = T_VECTORS.pop();
	    var point = T_VECTORS.pop();

	    // For each edge in the polygon:
	    for (var i = 0; i < len; i++) {
	      var next = i === len - 1 ? 0 : i + 1;
	      var prev = i === 0 ? len - 1 : i - 1;
	      var overlap = 0;
	      var overlapN = null;

	      // Get the edge.
	      edge.copy(polygon['edges'][i]);
	      // Calculate the center of the circle relative to the starting point of the edge.
	      point.copy(circlePos).sub(points[i]);

	      // If the distance between the center of the circle and the point
	      // is bigger than the radius, the polygon is definitely not fully in
	      // the circle.
	      if (response && point.len2() > radius2) {
	        response['aInB'] = false;
	      }

	      // Calculate which Voronoi region the center of the circle is in.
	      var region = voronoiRegion(edge, point);
	      // If it's the left region:
	      if (region === LEFT_VORONOI_REGION) {
	        // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
	        edge.copy(polygon['edges'][prev]);
	        // Calculate the center of the circle relative the starting point of the previous edge
	        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
	        region = voronoiRegion(edge, point2);
	        if (region === RIGHT_VORONOI_REGION) {
	          // It's in the region we want.  Check if the circle intersects the point.
	          var dist = point.len();
	          if (dist > radius) {
	            // No intersection
	            T_VECTORS.push(circlePos);
	            T_VECTORS.push(edge);
	            T_VECTORS.push(point);
	            T_VECTORS.push(point2);
	            return false;
	          } else if (response) {
	            // It intersects, calculate the overlap.
	            response['bInA'] = false;
	            overlapN = point.normalize();
	            overlap = radius - dist;
	          }
	        }
	        T_VECTORS.push(point2);
	        // If it's the right region:
	      } else if (region === RIGHT_VORONOI_REGION) {
	        // We need to make sure we're in the left region on the next edge
	        edge.copy(polygon['edges'][next]);
	        // Calculate the center of the circle relative to the starting point of the next edge.
	        point.copy(circlePos).sub(points[next]);
	        region = voronoiRegion(edge, point);
	        if (region === LEFT_VORONOI_REGION) {
	          // It's in the region we want.  Check if the circle intersects the point.
	          var dist = point.len();
	          if (dist > radius) {
	            // No intersection
	            T_VECTORS.push(circlePos);
	            T_VECTORS.push(edge);
	            T_VECTORS.push(point);
	            return false;
	          } else if (response) {
	            // It intersects, calculate the overlap.
	            response['bInA'] = false;
	            overlapN = point.normalize();
	            overlap = radius - dist;
	          }
	        }
	        // Otherwise, it's the middle region:
	      } else {
	        // Need to check if the circle is intersecting the edge,
	        // Change the edge into its "edge normal".
	        var normal = edge.perp().normalize();
	        // Find the perpendicular distance between the center of the 
	        // circle and the edge.
	        var dist = point.dot(normal);
	        var distAbs = Math.abs(dist);
	        // If the circle is on the outside of the edge, there is no intersection.
	        if (dist > 0 && distAbs > radius) {
	          // No intersection
	          T_VECTORS.push(circlePos);
	          T_VECTORS.push(normal);
	          T_VECTORS.push(point);
	          return false;
	        } else if (response) {
	          // It intersects, calculate the overlap.
	          overlapN = normal;
	          overlap = radius - dist;
	          // If the center of the circle is on the outside of the edge, or part of the
	          // circle is on the outside, the circle is not fully inside the polygon.
	          if (dist >= 0 || overlap < 2 * radius) {
	            response['bInA'] = false;
	          }
	        }
	      }

	      // If this is the smallest overlap we've seen, keep it. 
	      // (overlapN may be null if the circle was in the wrong Voronoi region).
	      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
	        response['overlap'] = overlap;
	        response['overlapN'].copy(overlapN);
	      }
	    }

	    // Calculate the final overlap vector - based on the smallest overlap.
	    if (response) {
	      response['a'] = polygon;
	      response['b'] = circle;
	      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
	    }
	    T_VECTORS.push(circlePos);
	    T_VECTORS.push(edge);
	    T_VECTORS.push(point);
	    return true;
	  }
	  SAT['testPolygonCircle'] = testPolygonCircle;

	  // Check if a circle and a polygon collide.
	  //
	  // **NOTE:** This is slightly less efficient than polygonCircle as it just
	  // runs polygonCircle and reverses everything at the end.
	  /**
	   * @param {Circle} circle The circle.
	   * @param {Polygon} polygon The polygon.
	   * @param {Response=} response Response object (optional) that will be populated if
	   *   they interset.
	   * @return {boolean} true if they intersect, false if they don't.
	   */
	  function testCirclePolygon(circle, polygon, response) {
	    // Test the polygon against the circle.
	    var result = testPolygonCircle(polygon, circle, response);
	    if (result && response) {
	      // Swap A and B in the response.
	      var a = response['a'];
	      var aInB = response['aInB'];
	      response['overlapN'].reverse();
	      response['overlapV'].reverse();
	      response['a'] = response['b'];
	      response['b'] = a;
	      response['aInB'] = response['bInA'];
	      response['bInA'] = aInB;
	    }
	    return result;
	  }
	  SAT['testCirclePolygon'] = testCirclePolygon;

	  // Checks whether polygons collide.
	  /**
	   * @param {Polygon} a The first polygon.
	   * @param {Polygon} b The second polygon.
	   * @param {Response=} response Response object (optional) that will be populated if
	   *   they interset.
	   * @return {boolean} true if they intersect, false if they don't.
	   */
	  function testPolygonPolygon(a, b, response) {
	    var aPoints = a['calcPoints'];
	    var aLen = aPoints.length;
	    var bPoints = b['calcPoints'];
	    var bLen = bPoints.length;
	    // If any of the edge normals of A is a separating axis, no intersection.
	    for (var i = 0; i < aLen; i++) {
	      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
	        return false;
	      }
	    }
	    // If any of the edge normals of B is a separating axis, no intersection.
	    for (var i = 0; i < bLen; i++) {
	      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
	        return false;
	      }
	    }
	    // Since none of the edge normals of A or B are a separating axis, there is an intersection
	    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
	    // final overlap vector.
	    if (response) {
	      response['a'] = a;
	      response['b'] = b;
	      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
	    }
	    return true;
	  }
	  SAT['testPolygonPolygon'] = testPolygonPolygon;

	  return SAT;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Key = function () {
	    function Key() {
	        _classCallCheck(this, Key);

	        this._pressed = {};
	    }

	    _createClass(Key, [{
	        key: 'isDown',
	        value: function isDown(keyCode) {
	            return this._pressed[keyCode];
	        }
	    }, {
	        key: 'onKeydown',
	        value: function onKeydown(event) {
	            this._pressed[event.code] = true;
	        }
	    }, {
	        key: 'onKeyup',
	        value: function onKeyup(event) {
	            delete this._pressed[event.code];
	        }
	    }]);

	    return Key;
	}();

	Key.LEFT = 'KeyA';
	Key.UP = 'Space';
	Key.RIGHT = 'KeyD';
	Key.ONE = 'Digit1';
	Key.TWO = 'Digit2';
	Key.THREE = 'Digit3';
	Key.FOUR = 'Digit4';
	exports.default = Key;
	;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Screen = function () {
	  function Screen(domCanvas) {
	    _classCallCheck(this, Screen);

	    var canvas = domCanvas;
	    this.ctx = canvas.getContext('2d');
	  }

	  _createClass(Screen, [{
	    key: 'addElements',
	    value: function addElements(elements) {
	      var _this = this;

	      elements.forEach(function (elem) {
	        var pos = elem.pos,
	            model = elem.model,
	            color = elem.color;

	        _this.ctx.fillStyle = color;
	        _this.ctx.fillRect(pos.x, pos.y, model.w, model.h);
	      });
	    }
	  }]);

	  return Screen;
	}();

	exports.default = Screen;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(3);

	var _base2 = _interopRequireDefault(_base);

	var _constants = __webpack_require__(13);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var GravityObject = function (_WorldObject) {
	  _inherits(GravityObject, _WorldObject);

	  function GravityObject() {
	    var _ref;

	    var _temp, _this, _ret;

	    _classCallCheck(this, GravityObject);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GravityObject.__proto__ || Object.getPrototypeOf(GravityObject)).call.apply(_ref, [this].concat(args))), _this), _this.speed = 0, _this.frozen = false, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(GravityObject, [{
	    key: 'right',
	    value: function right(to) {
	      if (this.frozen) return;
	      this.pos.x += to;
	    }
	  }, {
	    key: 'left',
	    value: function left(to) {
	      if (this.frozen) return;
	      this.pos.x -= to;
	    }
	  }, {
	    key: 'gravity',
	    value: function gravity(tick) {
	      if (this.frozen) return;
	      this.pos.y = this.pos.y - this.speed * tick + _constants.G * tick * tick / 2;
	      this.speed -= _constants.G;
	    }
	  }, {
	    key: 'jump',
	    value: function jump(speed) {
	      if (this.speed !== 0) return;
	      this.speed = speed;
	      this.pos.y -= 1;
	    }
	  }, {
	    key: 'freeze',
	    value: function freeze() {
	      this.frozen = true;
	    }
	  }]);

	  return GravityObject;
	}(_base2.default);

	exports.default = GravityObject;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var GROUND_POS = exports.GROUND_POS = 100;
	var G = exports.G = 9.8;

/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(3);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Fire = function (_WorldObject) {
	  _inherits(Fire, _WorldObject);

	  function Fire() {
	    _classCallCheck(this, Fire);

	    return _possibleConstructorReturn(this, (Fire.__proto__ || Object.getPrototypeOf(Fire)).apply(this, arguments));
	  }

	  _createClass(Fire, [{
	    key: 'update',
	    value: function update() {}
	  }, {
	    key: 'collide',
	    value: function collide() {}
	  }]);

	  return Fire;
	}(_base2.default);

	exports.default = Fire;

/***/ }
/******/ ]);