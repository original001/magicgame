import SAT from 'sat';
import {Ground, GroundItem} from './ground.js';

export const checkCollided = (objects, subject, callback) => {
  objects.forEach(obj => {
    const responce = new SAT.Response();
    const collided = SAT.testPolygonPolygon(subject.model.toPolygon(), obj.model.toPolygon(), responce);
    if (collided) {
      callback.call(null, obj, subject, responce);
    }
  })
}

export const collideEnemy = (enemy, player, responce) => {
  if (Math.abs(responce.overlapN.x) > 0) {
    player.dead();
  } else {
    enemy.dead();
    player.enabledSpells = player.enabledSpells.concat(enemy.enabledSpells);
  }
}

export const collideGround = (ground, creature, responce) => {
  if (ground && responce.overlap > 0) {
    if (ground instanceof Ground) {
      creature.pos.y = ground.pos.y - creature.model.h;
      creature.speed.y = 0;
      creature.mayJump = true;
    }

    if (ground instanceof GroundItem) {
      if (responce.overlapN.x > 0) {
        creature.pos.x = ground.pos.x - creature.model.w;
      }
      if (responce.overlapN.x < 0) {
        creature.pos.x = ground.pos.x + ground.model.w;
      }
      if (responce.overlapN.y > 0) {
        creature.pos.y = ground.pos.y - creature.model.h;
        creature.speed.y = 0;
        creature.mayJump = true;
      }
      if (responce.overlapN.y < 0) {
        creature.speed.y = 0;
        creature.pos.y = ground.pos.y + ground.model.h;
      }
    }
  }
}
