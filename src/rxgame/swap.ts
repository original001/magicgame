import { Box, Vector } from "sat";
import { sortWith, descend, ascend, tryCatch, F } from "ramda";

export const swap = (boxes: [Box, Box]): Box => {
  const [box1, box2] = sortWith(
    [ascend(box => box.pos.x), ascend(box => box.pos.y)],
    boxes
  ) as [Box, Box];

  if (box1.pos.y === box2.pos.y) {
    if (box1.h === box2.h && box2.pos.x - box1.pos.x <= box1.w) {
      return new Box(
        new Vector(box1.pos.x, box1.pos.y),
        box2.pos.x + box2.w - box1.pos.x,
        box1.h
      );
    }
  }

  if (box1.pos.x === box2.pos.x) {
    if (box1.w === box2.w && box2.pos.y - box1.pos.y <= box1.h) {
      return new Box(
        new Vector(box1.pos.x, box1.pos.y),
        box1.w,
        box2.pos.y + box2.h - box1.pos.y,
      );
    }
  }

  throw new Error("cannot swap boxes");
};

export const isSwapping = tryCatch(boxes => !!swap(boxes), F);

export const swapN = (boxes: Box[]): Box[] => {
  const sortedBoxes = sortWith<Box>([
    ascend(box => box.pos.x),
    ascend(box => box.pos.y)
  ])(boxes);

  const swappedBoxes = [];

  const tail = sortedBoxes.reduce((acc, box, ind, array) => {
    if (isSwapping([acc, box])) {
      return swap([acc, box]);
    }
    swappedBoxes.push(acc);
    return box;
  });

  swappedBoxes.push(tail);

  return swappedBoxes;
};
