import { Box, Vector } from "sat";
import { sortWith, descend, ascend } from "ramda";

export const swap = (boxes: [Box, Box]): Box => {
  const [box1, box2] = sortWith(
    [ascend(box => box.pos.x), ascend(box => box.pos.y)],
    boxes
  ) as [Box, Box];

  if (box1.pos.y === box2.pos.y) {
    if (box1.h === box2.h) {
      return new Box(
        new Vector(box1.pos.x, box1.pos.y),
        box1.w + box2.w,
        box1.h
      );
    }
  }

  if (box1.pos.x === box2.pos.x) {
    if (box1.w === box2.w) {
      return new Box(
        new Vector(box1.pos.x, box1.pos.y),
        box1.w,
        box1.h + box2.h
      );
    }
  }

  throw new Error("cannot swap boxes");
};
