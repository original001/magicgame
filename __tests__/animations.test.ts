import { nextTexture } from "../src/rxgame/animations";
import { vec } from '../src/rxgame/utils';

const nextTestTexture = nextTexture([1,2,3,7,8,9])

describe("animations", () => {
  it("", () => {
    expect(nextTestTexture('right', 100)).toBe(1);
    expect(nextTestTexture('right-run', 200)).toBe(3);
    expect(nextTestTexture('left', 100)).toBe(7);
    expect(nextTestTexture('left-run', 200)).toBe(9);
    expect(nextTestTexture('left-jump', 100)).toBe(8);
    expect(nextTestTexture('right-jump', 100)).toBe(2);
  });
});
