import { Box, Vector, testPolygonPolygon, Response } from "sat";
import { Entity } from "./fabric";
import { minBy, sortBy, max } from "ramda";

const findDx = (box1: Box, box2: Box) => {
  const [leftBox, rightBox] = sortBy(box => box.pos.x, [box1, box2]);
  return max(leftBox.pos.x + leftBox.w - rightBox.pos.x, 0);
};

const findDy = (box1: Box, box2: Box) => {
  const [topBox, bottomBox] = sortBy(box => box.pos.y, [box1, box2]);
  return max(topBox.pos.y + topBox.h - bottomBox.pos.y, 0);
};

export const collide = (box1: Box, box2: Box) => {
  const res = new Response();
  const isCollided = testPolygonPolygon(
    box1.toPolygon(),
    box2.toPolygon(),
    res
  ) && !(res.overlapV.x === 0 && res.overlapV.y === 0);

  return {
    overlapN: res.overlapN,
    overlapV: res.overlapV,
    isCollided,
    dx: isCollided ? findDx(box1, box2) : 0,
    dy: isCollided ? findDy(box1, box2) : 0
  }
};

export const collideN = (sourceBox: Box, ...entities: Entity[]) => {
  const initialVectors = {
    overlapN: new Vector(),
    overlapV: new Vector()
  };
  const collidedBoxes = entities.filter(entity => {
    const res = new Response();
    const isCollided = testPolygonPolygon(
      sourceBox.toPolygon(),
      entity.box.toPolygon(),
      res
    );
    return isCollided && !(res.overlapV.x === 0 && res.overlapV.y === 0);
  });

  const rewrite = (val: number, override: number) =>
    val === 0 ? override : val;

  const sumOverlap = (acc: Vector, val: Vector) =>
    new Vector(rewrite(acc.x, val.x), rewrite(acc.y, val.y));

  const vectors = collidedBoxes.reduce(({ overlapN, overlapV }, entity) => {
    const res = new Response();
    testPolygonPolygon(sourceBox.toPolygon(), entity.box.toPolygon(), res);
    const newVector = {
      overlapN: sumOverlap(overlapN, res.overlapN),
      overlapV: sumOverlap(overlapV, res.overlapV)
    };
    return newVector;
  }, initialVectors);

  const isCollided = collidedBoxes.length > 0;

  return {
    isCollided,
    ...vectors
  };
};

const cloneBox = ({ pos, w, h }: Box) =>
  new Box(new Vector(pos.x, pos.y), w, h);

export const onGround = (box: Box, terrains: Entity[]) => {
  const testBox1 = cloneBox(box);
  testBox1.pos.y += 1;
  const testBox2 = cloneBox(box);
  testBox2.pos.y += box.h;
  return terrains.some(
    terrain =>
      collideN(testBox1, terrain).overlapV.y === 1 &&
      (Math.abs(collideN(testBox2, terrain).overlapV.x) > 4 ||
        collideN(testBox2, terrain).overlapV.y === 20)
  );
};
