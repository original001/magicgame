import * as flyd from 'flyd'
import {resetAfter} from '../src//streamUtils'

jest.useFakeTimers();


describe("streamUtils", () => {
  it("resetAfter", () => {
    const s = flyd.stream(1);
    const res = resetAfter(200, s)
    expect(res()).toBe(1)
    jest.runOnlyPendingTimers();
    expect(res()).toBeUndefined();
    s(2)
    expect(res()).toBe(2);
    s(3)
    expect(res()).toBe(3);
    jest.runOnlyPendingTimers();
    expect(res()).toBeUndefined();
  });
});
