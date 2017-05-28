import Spell from './spell';
import BoltSpell from './bolt';
import TakeSpell from './take';

export enum SpellType {
  BOLT,
  TELEPORT,
  FREEZE,
  KICK,
  FIRE,
  TAKE,
}

export const colors = {
  [SpellType.BOLT]: 'blue',
  [SpellType.TAKE]: 'white',
};

export const createSpell = (source) => {
  if (source.enabledSpells.length === 0) {
    return null;
  }

  const type = source.enabledSpells[0];

  let spell = null;

  switch (type) {
    case SpellType.BOLT:
      spell = new BoltSpell(source);
      break;
    case SpellType.TAKE:
      spell = new TakeSpell(source);
      break;
    // case SpellType.TELEPORT:
    //   spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'purple');
    //   spell.update = function(tick) {
    //     this.pos.x += tick * 100 * source.direction;
    //   }
    //   spell.collide = function(target, player) {
    //     const targetPos = target.pos.x;
    //     target.pos.x = player.pos.x;
    //     player.pos.x = targetPos;
    //   }
    //   break;
    // case SpellType.FREEZE:
    //   spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'green');
    //   spell.update = function(tick) {
    //     this.pos.x += tick * 100 * source.direction;
    //   }
    //   spell.collide = function(target) {
    //     target.freeze();
    //   }
    //   break;
    // case SpellType.KICK:
    //   spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 5, 5, 'red');
    //   spell.update = function(tick) {
    //     this.pos.x += tick * 100 * source.direction;
    //   }
    //   spell.collide = function(target) {
    //     target.jump(400);
    //   }
    //   break;
    // case SpellType.FIRE:
    //   spell = new Spell(source.pos.x + source.model.w, source.pos.y + 10, 20, 20, 'orange');
    //   spell.update = function(tick) {
    //     if (this.model.w == 0) return;
    //     this.pos.x += tick * 100 * source.direction;
    //     this.model.w -= 1;
    //     this.model.h -= 1;
    //   }
    //   spell.collide = function(target) {
    //     target.dead(400);
    //   }
    //   break;
    default:
      throw new Error('Unknown spell')
  }
  source.currentSpell = spell;

  return spell;
}
