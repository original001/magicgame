import WorldObject from './base.js';
import SAT from 'sat';

export const BOLT = 1;
export const TELEPORT = 2;
export const FREEZE = 3;
export const KICK = 4;
export const FIRE = 5;
export const TAKE = 6;

export const colors = {
  [BOLT]: 'blue',
  [TAKE]: 'white',
}

class Spell extends WorldObject {
  startTime = 0;
  speed = 0;
  _resolve = () => {};
  promise = new Promise(resolve => {
    this._resolve = resolve;
  });

  /* abstract */
  update(tick) {throw ''} 
  /* abstract */
  collide(target) {throw ''} 
}

class BoltSpell extends Spell {
  constructor(source) {
    const pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
    const model = new SAT.Box(pos, 5, 5);
    super(model.pos.x, model.pos.y, model.w, model.h);
    this.model = model;
    this.pos = pos;
    this.speed = 400 * source.direction;
    this.color = 'blue';
    this.source = source;
  }
  /* ovveride */
  update(tick) {
    if (this.startTime > 2) {
      this._resolve();
    }
    this.pos.x += tick * this.speed;
    this.startTime += tick;
  }
  /* ovveride */
  collide(target) {
    if (target === this.source) return;
    target.dead();
    this._resolve();
  }
}

export const createSpell = (source, type) => {
  switch (type) {
    case BOLT:
      return new BoltSpell(source);
      break;
    case TAKE:
      spell.pos = new SAT.Vector(source.pos.x + source.model.w/2, source.pos.y + 10);
      spell.model = new SAT.Box(spell.pos, 10, 10);
      spell.color = 'gray';
      const startPos = spell.pos;
      spell.update = function(tick) {
        if (this.startTime > 0.15) {
          _resolve();
        }
        this.model.w += tick * speed;
        this.startTime += tick;
      }
      spell.collide = function(target) {
        if (target === source) return;
        if (target.enabledSpells && source.enabledSpells && source.enabledSpells.indexOf(target.enabledSpells) === -1) {
          source.enabledSpells = target.enabledSpells.concat(source.enabledSpells);
          target.enabledSpells.splice(0, 1);
        }
        _resolve();
      }
      break;

    case TELEPORT:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'purple');
      spell.update = function(tick) {
        this.pos.x += tick * 100 * source.direction;
      }
      spell.collide = function(target, player) {
        const targetPos = target.pos.x;
        target.pos.x = player.pos.x;
        player.pos.x = targetPos;
      }
      break;
    case FREEZE:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'green');
      spell.update = function(tick) {
        this.pos.x += tick * 100 * source.direction;
      }
      spell.collide = function(target) {
        target.freeze();
      }
      break;
    case KICK:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'red');
      spell.update = function(tick) {
        this.pos.x += tick * 100 * source.direction;
      }
      spell.collide = function(target) {
        target.jump(400);
      }
      break;
    case FIRE:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 20, 20, 'orange');
      spell.update = function(tick) {
        if (this.model.w == 0) return;
        this.pos.x += tick * 100 * source.direction;
        this.model.w -= 1;
        this.model.h -= 1;
      }
      spell.collide = function(target) {
        target.dead(400);
      }
      break;
    default:
      throw new Error('Unknown spell')
  }
  return spell;
}
