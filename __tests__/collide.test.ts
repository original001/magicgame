import { Box, Vector, testPolygonPolygon, Response } from "sat";
import { Entity } from "../src/rxgame/fabric";
import { collideN, onGround, collide } from "../src/rxgame/collide";

const blockMarkup = {
  id: 1,
  texture: {
    stat: 1
  }
};

describe("collideN", () => {
  it("shouldn't collided", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(90, 20), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(110, 20), 20, 20)
      }
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(0);
    expect(overlapV.y).toBe(0);
    expect(isCollided).toBeFalsy();
  });
  it("should collided in same axis", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 21);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(90, 20), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(110, 20), 20, 20)
      }
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(0);
    expect(overlapV.y).toBe(1);
    expect(isCollided).toBeTruthy();
  });
  it("should collided in different axis", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(100, 15), 20, 20)
      }
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(-3);
    expect(overlapV.y).toBe(5);
    expect(overlapN.x).toBe(-1);
    expect(overlapN.y).toBe(1);
    expect(isCollided).toBeTruthy();
  });
  it("should collided in same horizontal axis", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(81, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(81, 20), 20, 20)
      }
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(-1);
    expect(overlapV.y).toBe(0);
    expect(overlapN.x).toBe(-1);
    expect(overlapN.y).toBe(0);
    expect(isCollided).toBeTruthy();
  });
});

describe("onGround", () => {
  it("should return true if box right over blocks", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(90, 20), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(110, 20), 20, 20)
      }
    ];
    const isOnGround = onGround(sourceBox, blocks);
    expect(isOnGround).toBeTruthy();
  });
  it("should return false if box overlaps under blocks", () => {
    const sourceBox = new Box(new Vector(100, 1), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(90, 20), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(110, 20), 20, 20)
      }
    ];
    const isOnGround = onGround(sourceBox, blocks);
    expect(isOnGround).toBeFalsy();
  });
  it("should return true on ground even if overlap horizontal block", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(100, 20), 20, 20)
      }
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, blocks[1]);
    console.log(overlapN, overlapV, isCollided);
    const isOnGround = onGround(sourceBox, blocks);
    expect(isOnGround).toBeTruthy();
  });
  it("should return false in ground even if overlap horizontal block", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(100, 10), 20, 20)
      }
    ];
    const isOnGround = onGround(sourceBox, blocks);
    expect(isOnGround).toBeFalsy();
  });
  it("should return false near two horizontal blocks", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 20), 20, 20)
      }
    ];
    const isOnGround = onGround(sourceBox, blocks);
    expect(isOnGround).toBeFalsy();
  });
  it("should return false near two horizontal blocks on corner", () => {
    const sourceBox = new Box(new Vector(100, 3), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(83, 20), 20, 20)
      }
    ];
    const isOnGround = onGround(sourceBox, blocks);
    expect(isOnGround).toBeFalsy();
  });
});

describe("collide", () => {
  it("should work on x axis", () => {
    const box1 = new Box(new Vector(100, 0), 20, 20);
    const box2 = new Box(new Vector(83, 0), 20, 20);

    const { overlapN, overlapV, dx, dy, isCollided } = collide(box1, box2);
    expect(`
N: ${overlapN.x}, ${overlapN.y}
V: ${overlapV.x}, ${overlapV.y}
delta: ${dx}, ${dy}
isCollided: ${isCollided}
`).toBe(`
N: -1, 0
V: -3, 0
delta: 3, 20
isCollided: true
`);
  });
  it("should work on y axis", () => {
    const box1 = new Box(new Vector(100, 0), 20, 20);
    const box2 = new Box(new Vector(100, 17), 20, 20);

    const { overlapN, overlapV, dx, dy, isCollided } = collide(box1, box2);
    expect(`
N: ${overlapN.x}, ${overlapN.y}
V: ${overlapV.x}, ${overlapV.y}
delta: ${dx}, ${dy}
isCollided: ${isCollided}
`).toBe(`
N: 0, 1
V: 0, 3
delta: 20, 3
isCollided: true
`);
  });
  it("should work on x, y axis", () => {
    const box1 = new Box(new Vector(100, 0), 20, 20);
    const box2 = new Box(new Vector(85, 17), 20, 20);

    const { overlapN, overlapV, dx, dy, isCollided } = collide(box1, box2);
    expect(`
N: ${overlapN.x}, ${overlapN.y}
V: ${overlapV.x}, ${overlapV.y}
delta: ${dx}, ${dy}
isCollided: ${isCollided}
`).toBe(`
N: 0, 1
V: 0, 3
delta: 5, 3
isCollided: true
`);
  });
  it("should work if there is no intersection", () => {
    const box1 = new Box(new Vector(100, 0), 20, 20);
    const box2 = new Box(new Vector(80, 21), 20, 20);

    const { overlapN, overlapV, dx, dy, isCollided } = collide(box1, box2);
    expect(`
N: ${overlapN.x}, ${overlapN.y}
V: ${overlapV.x}, ${overlapV.y}
delta: ${dx}, ${dy}
isCollided: ${isCollided}
`).toBe(`
N: 0, 0
V: 0, 0
delta: 0, 0
isCollided: false
`);
  });
  it("should work if boxes are siblings", () => {
    const box1 = new Box(new Vector(100, 0), 20, 20);
    const box2 = new Box(new Vector(100, 20), 20, 20);

    const { overlapN, overlapV, dx, dy, isCollided } = collide(box1, box2);
    expect(`
N: ${overlapN.x}, ${overlapN.y}
V: ${overlapV.x}, ${overlapV.y}
delta: ${dx}, ${dy}
isCollided: ${isCollided}
`).toBe(`
N: 0, -1
V: 0, 0
delta: 0, 0
isCollided: false
`);
  });
});
