import {Creature, terrains} from './index'
import { onGround } from './collide';
import {Box, Vector} from 'sat'

const G = 9.8;

export const moveCreature = (
  creature: Creature,
  timeDelta,
  { x: speedX, y: speedY }
): Creature => {
  const { speed, box } = creature;
  const { x, y } = box.pos;
  const isOnGround = onGround(creature.box, terrains.map(t => t.box));
  const newSpeedX = speedX;
  const newSpeedY = isOnGround ? speedY : speed.y + G;
  const newCreature = {
    ...creature,
    box: new Box(
      new Vector(x + newSpeedX * timeDelta, y + newSpeedY * timeDelta),
      box.w,
      box.h
    ),
    speed: new Vector(newSpeedX, newSpeedY)
  };
  return newCreature;
};
