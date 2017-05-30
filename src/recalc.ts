import {G} from './constants';
import Player from './player';
import WorldObject, {MovementMode} from './base';
import TakeSpell from './spell/take';

//todo: cover by tests
export const recalc = (tick: number, objects: WorldObject[]) => {
    objects.forEach(function calc(obj) {
      if (obj.movementMode === MovementMode.Static) return;
      if (obj.movementMode === MovementMode.Linear) {
        obj.pos.x += obj.speed.x * tick;
        obj.pos.y += obj.speed.y * tick;
      }
      if (obj.movementMode === MovementMode.Accelerate) {
        obj.pos.x += obj.speed.x * tick;
        obj.pos.y = obj.pos.y - obj.speed.y * tick + G * tick * tick / 2;
        obj.speed.y -= G;
      }
      // creature.color = creature.enabledSpells[0] ? colors[creature.enabledSpells[0]] : 'black';
    }.bind(this));
}
