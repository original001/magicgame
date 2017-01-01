import WorldObject from './base.js';

export default class Spell extends WorldObject {
  static BOLT = 1;
  static TELEPORT = 2;
  static FREEZE = 3;
  static KICK = 4;
  static FIRE = 5;

  update() {} 
  collide() {} 
}

export const createSpell = (source, type) => {
  let spell;
  switch (type) {
    case Spell.BOLT:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'blue');
      spell.update = function(tick) {
        this.pos.x += tick * 100
      }
      spell.collide = function(target) {
        target.dead();
      }
      break;
    case Spell.TELEPORT:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'purple');
      spell.update = function(tick) {
        this.pos.x += tick * 100
      }
      spell.collide = function(target, player) {
        const targetPos = target.pos.x;
        target.pos.x = player.pos.x;
        player.pos.x = targetPos;
      }
      break;
    case Spell.FREEZE:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'green');
      spell.update = function(tick) {
        this.pos.x += tick * 100
      }
      spell.collide = function(target) {
        target.freeze();
      }
      break;
    case Spell.KICK:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'red');
      spell.update = function(tick) {
        this.pos.x += tick * 100
      }
      spell.collide = function(target) {
        target.jump(400);
      }
      break;
    case Spell.FIRE:
      spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 20, 20, 'orange');
      spell.update = function(tick) {
        if (this.model.w == 0) return;
        this.pos.x += tick * 100
        this.model.w -= 1;
        this.model.h -= 1;
      }
      spell.collide = function(target) {
        target.dead(400);
      }
      break;
  }
  return spell;
}
