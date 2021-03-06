import { Box, Vector, testPolygonPolygon, Response } from "sat";
import { Entity } from "./fabric";
import { minBy, sortBy, max, maxBy, always } from "ramda";
import { abs, vec, sign } from "./utils";
import { Player } from "./index";
import { swapN } from "./swap";

const findDx = (box1: Box, box2: Box) => {
  const [leftBox, rightBox] = sortBy(box => box.pos.x, [box1, box2]);
  return max(leftBox.pos.x + leftBox.w - rightBox.pos.x, 0);
};

const findDy = (box1: Box, box2: Box) => {
  const [topBox, bottomBox] = sortBy(box => box.pos.y, [box1, box2]);
  return max(topBox.pos.y + topBox.h - bottomBox.pos.y, 0);
};

const rewrite = (val: number, override: number) => (val === 0 ? override : val);

export const sumOverlap = (
  { x: x1, y: y1 }: Vector,
  { x: x2, y: y2 }: Vector
) => {
  return new Vector(maxBy(n => abs(n), x1, x2), maxBy(n => abs(n), y1, y2));
};

export const collide = (box1: Box, box2: Box) => {
  const res = new Response();
  const { overlapN, overlapV } = res;
  const isCollided =
    testPolygonPolygon(box1.toPolygon(), box2.toPolygon(), res) &&
    !(overlapV.x === 0 && overlapV.y === 0);

  return {
    overlapN,
    overlapV,
    isCollided,
    dx: findDx(box1, box2),
    dy: findDy(box1, box2),
    onGround:
      overlapN.y === -1 &&
      overlapV.y === 0 &&
      box1.pos.y < box2.pos.y &&
      findDx(box1, box2) > 0
  };
};

export const collideN = (sourceBox: Box, ...boxes: Box[]) => {
  const initialVectors = {
    overlapN: new Vector(),
    overlapV: new Vector(),
    isCollided: false,
    collided: [] as Box[],
    onGround: false
  };

  const vectors = boxes.reduce((vectors, box) => {
    const { overlapV, overlapN, isCollided, collided, onGround } = vectors;
    const res = collide(sourceBox, box);
    return {
      overlapV: sumOverlap(overlapV, res.overlapV),
      overlapN: sumOverlap(overlapN, res.overlapN),
      isCollided: isCollided || res.isCollided,
      collided: res.isCollided ? collided.concat(box) : collided,
      onGround: onGround || res.onGround
    };
  }, initialVectors);

  return vectors;
};

const cloneBox = ({ pos, w, h }: Box) =>
  new Box(new Vector(pos.x, pos.y), w, h);

export const onGround = (sourceBox: Box, boxes: Box[]) => {
  return boxes.some(box => {
    const { onGround } = collide(sourceBox, box);
    return onGround;
  });
};

const overlapNToSpeed = (overlap: number) => (abs(overlap) >= 1 ? 0 : 1);

export const adjustPlayer = (player: Player, boxes: Box[]) => {
  const { isCollided, collided } = collideN(player.box, ...boxes);

  if (isCollided) {
    const swapped = swapN(collided);

    const { overlapN, overlapV } = collideN(player.box, ...swapped);
    const newPos = player.box.pos.clone();
    const newSpeed = player.speed.clone();

    newPos.sub(overlapV);
    newSpeed.scale(overlapNToSpeed(overlapN.x), overlapNToSpeed(overlapN.y));

    const dir = vec(
      sign(newSpeed.x) || player.dir.x,
      sign(newSpeed.y)
    );

    return {
      ...player,
      box: new Box(newPos, player.box.w, player.box.h),
      speed: newSpeed,
      dir
    };
  }
  
  const dir = vec(
    sign(player.speed.x) || player.dir.x,
    sign(player.speed.y)
  );

  return {
    ...player,
    dir
  };
};
