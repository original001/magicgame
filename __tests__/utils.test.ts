import { next , nextByMod } from '../src//utils';

describe("next", () => {
  it("after first will second", () => {
    expect(next([1,2,3], 1)).toBe(2)
  });
  it("after second will third", () => {
    expect(next([1,2,3], 2)).toBe(3)
  });
  it("after last will first", () => {
    expect(next([1,2,3], 3)).toBe(1)
  });
  it("if not exist will first", () => {
    expect(next([1,2,3], 4)).toBe(1)
  });
});

describe('nextByMod', () => {
  it('', () => {
    expect(nextByMod([1,2,3], 0)).toBe(1);
    expect(nextByMod([1,2,3], 1)).toBe(2);
    expect(nextByMod([1,2,3], 2)).toBe(3);
    expect(nextByMod([1,2,3], 3)).toBe(1);
    expect(nextByMod([1,2,3], 4)).toBe(2);
  })
})
