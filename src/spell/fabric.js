import Spell from './spell';
import BoltSpell from './bolt.js';
import TakeSpell from './take.js';

export const BOLT = 1;
export const TELEPORT = 2;
export const FREEZE = 3;
export const KICK = 4;
export const FIRE = 5;
export const TAKE = 6;

export const colors = {
  [BOLT]: 'blue',
  [TAKE]: 'white',
};

export const createSpell = (source) => {
  if (source.enabledSpells.length === 0 || (source.currentSpell && source.currentSpell.active)) {
    return null;
  }

  const type = source.enabledSpells[0];

  let spell = null;

  switch (type) {
    case BOLT:
      spell = new BoltSpell(source);
      break;
    case TAKE:
      spell = new TakeSpell(source);
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
  source.currentSpell = spell;

  return spell;
}