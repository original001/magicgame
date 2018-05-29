import { Vector } from "sat";
import { Player } from "./index";
import { next, nextByMod } from "./utils";

export type AnimationState =
  | "right-run"
  | "left-run"
  | "left"
  | "right"
  | "left-jump"
  | "right-jump";

export const nextTexture = ([r1, r2, r3, l1, l2, l3]: number[]) => (
  animation: AnimationState,
  interval: number
): number => {
  switch (animation) {
    case "right-run":
      return nextByMod([r1, r2, r3], interval);
    case "left-run":
      return nextByMod([l1, l2, l3], interval);
    case "left":
      return l1;
    case "right":
      return r1;
    case "right-jump":
      return r2;
    case "left-jump":
      return l2;
    default:
      throw new Error("unexpected animation state");
  }
};

export const getAnimationState = (
  dir: Vector,
  speed: Vector
): AnimationState => {
  if (dir.y === 0) {
    if (dir.x === 1) {
      if (speed.x > 0) {
        return "right-run";
      } else {
        return "right";
      }
    }
    if (dir.x === -1) {
      if (speed.x < 0) {
        return "left-run";
      } else {
        return "left";
      }
    }
  } else {
    if (dir.x === 1) {
      return "right-jump";
    }
    if (dir.x === -1) {
      return "left-jump";
    }
  }
};
