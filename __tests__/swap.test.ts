import { swap } from "../src/rxgame/swap";
import { Box, Vector } from "sat";

describe("swap", () => {
  it("should swap vertical boxes", () => {
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(80, 65), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 20, h: 40 });
  });
  it("should swap horizontal boxes", () => {
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(100, 45), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 40, h: 20 });
  });
  it("should swap reverse horizontal boxes", () => {
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(80, 45), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 40, h: 20 });
  });
  it("shouldn't swap diagonal boxes", () => {
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(80, 65), 20, 20);
    expect(() => swap([box1, box2])).toThrow()
  });
  it("should swap reverse vertical boxes", () => {
    const box1 = new Box(new Vector(80, 65), 20, 20);
    const box2 = new Box(new Vector(80, 45), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 20, h: 40 });
  });
});
