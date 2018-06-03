import { swap , swapN } from "../src//swap";
import { Box, Vector } from "sat";

describe("swap", () => {
  it("should swap vertical boxes", () => {
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(80, 65), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 20, h: 40 });
  });
  it("should swap vertical boxes", () => {
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(80, 55), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 20, h: 30 });
  });
  it("should swap reverse vertical boxes", () => {
    const box1 = new Box(new Vector(80, 65), 20, 20);
    const box2 = new Box(new Vector(80, 45), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 20, h: 40 });
  });
  it("should swap horizontal boxes", () => {
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(100, 45), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 80, y: 45 }, w: 40, h: 20 });
  });
  it("should swap horizontal boxes", () => {
    const box1 = new Box(new Vector(90, 45), 20, 20);
    const box2 = new Box(new Vector(100, 45), 20, 20);
    const box = swap([box1, box2]);
    expect(box).toEqual({ pos: { x: 90, y: 45 }, w: 30, h: 20 });
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
  it("shouldn't swap non-interasected vertical boxes", () => {
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(100, 75), 20, 20);
    expect(() => swap([box1, box2])).toThrow()
  });
  it("shouldn't swap non-interasected horizontal boxes", () => {
    const box1 = new Box(new Vector(70, 45), 20, 20);
    const box2 = new Box(new Vector(100, 45), 20, 20);
    expect(() => swap([box1, box2])).toThrow()
  });
});

describe('swapN', () => {
  it("should swap only two boxes", () => {
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(100, 45), 20, 20);
    const box3 = new Box(new Vector(140, 65), 20, 20);
    const swapped = swapN([box1, box2, box3]);
    expect(swapped.length).toBe(2);
  });
  it("should swap only two boxes", () => {
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(100, 65), 20, 20);
    const box3 = new Box(new Vector(140, 65), 20, 20);
    const swapped = swapN([box1, box2, box3]);
    expect(swapped.length).toBe(2);
  });
  it("should swap only two boxes", () => {
    const box3 = new Box(new Vector(140, 65), 20, 20);
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(100, 65), 20, 20);
    const swapped = swapN([box1, box2, box3]);
    expect(swapped.length).toBe(2);
  });
  it("should swap all boxes", () => {
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(100, 65), 20, 20);
    const box3 = new Box(new Vector(100, 75), 20, 20);
    const swapped = swapN([box1, box2, box3]);
    expect(swapped.length).toBe(1);
    expect(swapped[0].h).toBe(50)
  });
  it("should swap two pair", () => {
    const box1 = new Box(new Vector(100, 45), 20, 20);
    const box2 = new Box(new Vector(100, 65), 20, 20);
    const box3 = new Box(new Vector(120, 85), 20, 20);
    const box4 = new Box(new Vector(140, 85), 20, 20);
    const swapped = swapN([box1, box2, box3, box4]);
    expect(swapped.length).toBe(2);
  });
})
