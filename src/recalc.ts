import {G} from './constants';
import WorldObject, {MovementMode} from './base';

export const recalc = (tick: number, objects: WorldObject[]) => {
    objects.forEach(function calc(obj) {
      if (obj.movementMode = MovementMode.Static) return;
      if (obj.movementMode = MovementMode.Linear) {
        obj.pos.x += obj.speed.x * tick;
      }
      if (obj.movementMode = MovementMode.Accelerate) {
        obj.pos.x += obj.speed.x * tick;
        obj.speed.x = 0;
        obj.pos.y = obj.pos.y - obj.speed.y * tick + G * tick * tick / 2;
        obj.speed.y -= G;
      }
      if (obj.children.length > 0) {
        obj.children.forEach(calc.bind(this));
      }
      // creature.color = creature.enabledSpells[0] ? colors[creature.enabledSpells[0]] : 'black';
    }.bind(this));
}
