import WorldObject from './base.js';
import SAT from 'sat';

export const BOLT = 1;
export const TELEPORT = 2;
export const FREEZE = 3;
export const KICK = 4;
export const FIRE = 5;

export default class Spell extends WorldObject {
  finished = false;
  startTime = 0;
  update() {} 
  collide() {} 
}

export const createSpell = (creature, type) => {
  let spell = new Spell(0, 0, 0, 0, 'black');
  let _resolve;
  const promise = new Promise(resolve => {
    _resolve = resolve;
  })
  spell.promise = promise;
  const speed = 400 * creature.direction;
  switch (type) {
    case BOLT:
      spell.pos = new SAT.Vector(creature.pos.x + creature.model.w/2, creature.pos.y + 10);
      spell.model = new SAT.Box(spell.pos, 5, 5);
      spell.color = 'blue';
      spell.update = function(tick) {
        if (this.startTime > 2) {
          _resolve();
        }
        this.pos.x += tick * speed;
        this.startTime += tick;
      }
      spell.collide = function(target) {
        if (target === creature) return;
        target.collideSpell();
        _resolve();
      }
      break;
    case TELEPORT:
      spell = new Spell(creature.pos.x + creature.model.w, creature.pos.y + 10, 5, 5, 'purple');
      spell.update = function(tick) {
        this.pos.x += tick * 100 * creature.direction;
      }
      spell.collide = function(target, player) {
        const targetPos = target.pos.x;
        target.pos.x = player.pos.x;
        player.pos.x = targetPos;
      }
      break;
    case FREEZE:
      spell = new Spell(creature.pos.x + creature.model.w, creature.pos.y + 10, 5, 5, 'green');
      spell.update = function(tick) {
        this.pos.x += tick * 100 * creature.direction;
      }
      spell.collide = function(target) {
        target.freeze();
      }
      break;
    case KICK:
      spell = new Spell(creature.pos.x + creature.model.w, creature.pos.y + 10, 5, 5, 'red');
      spell.update = function(tick) {
        this.pos.x += tick * 100 * creature.direction;
      }
      spell.collide = function(target) {
        target.jump(400);
      }
      break;
    case FIRE:
      spell = new Spell(creature.pos.x + creature.model.w, creature.pos.y + 10, 20, 20, 'orange');
      spell.update = function(tick) {
        if (this.model.w == 0) return;
        this.pos.x += tick * 100 * creature.direction;
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
