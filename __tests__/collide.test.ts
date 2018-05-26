import { Box, Vector, testPolygonPolygon, Response } from "sat";
import { Entity } from "../src/rxgame/fabric";
import { collideN, onGround, collide, sumOverlap , adjustPlayer } from "../src/rxgame/collide";
import { Player } from "../src/rxgame/index";

const blockMarkup = {
  id: 1,
  texture: {
    stat: 1
  }
};

describe("collideN", () => {
  it("shouldn't collided", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks = [
      new Box(new Vector(90, 20), 20, 20),
      new Box(new Vector(110, 20), 20, 20)
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(0);
    expect(overlapV.y).toBe(0);
    expect(isCollided).toBeFalsy();
  });
  it("should collided in same axis", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 21);
    const blocks = [
      new Box(new Vector(90, 20), 20, 20),
      new Box(new Vector(110, 20), 20, 20)
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(0);
    expect(overlapV.y).toBe(1);
    expect(isCollided).toBeTruthy();
  });
  it("should collided in different axis", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks = [
      new Box(new Vector(83, 0), 20, 20),
      new Box(new Vector(100, 15), 20, 20)
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(-3);
    expect(overlapV.y).toBe(5);
    expect(overlapN.x).toBe(-1);
    expect(overlapN.y).toBe(1);
    expect(isCollided).toBeTruthy();
  });
  xit("should collided in same horizontal axis", () => {
    const sourceBox = new Box(new Vector(100, 0), 20, 20);
    const blocks = [
      new Box(new Vector(81, 0), 20, 20),
      new Box(new Vector(81, 20), 20, 20)
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(-1);
    expect(overlapV.y).toBe(0);
    expect(overlapN.x).toBe(-1);
    expect(overlapN.y).toBe(0);
    expect(isCollided).toBeTruthy();
  });
  xit("should collided with upper blocks", () => {
    const sourceBox = new Box(new Vector(403.2, 278.4), 20, 20);
    const blocks = [
      new Box(new Vector(400, 260), 20, 20),
      new Box(new Vector(420, 260), 20, 20)
    ];
    const { overlapN, overlapV, isCollided } = collideN(sourceBox, ...blocks);
    expect(overlapV.x).toBe(0);
    expect(overlapV.y).toBe(1.6);
    expect(overlapN.x).toBe(0);
    expect(overlapN.y).toBe(1);
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
    const { overlapN, dx } = collide(sourceBox, blocks[0].box);
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
  it("should return false near two upper blocks", () => {
    const sourceBox = new Box(new Vector(100, 20), 20, 20);
    const blocks: Entity[] = [
      {
        ...blockMarkup,
        box: new Box(new Vector(90, 0), 20, 20)
      },
      {
        ...blockMarkup,
        box: new Box(new Vector(100, 0), 20, 20)
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
delta: 20, 0
isCollided: false
`);
  });
});

describe("sumOverlapV", () => {
  it("should work on different axis", () => {
    const { x, y } = sumOverlap(new Vector(1, -2), new Vector(2, 0));
    expect(x).toBe(2);
    expect(y).toBe(-2);
  });
});

describe("sumOverlapN", () => {
  it("should work on different axis", () => {
    const { x, y } = sumOverlap(new Vector(1, -1), new Vector(1, 0));
    expect(x).toBe(1);
    expect(y).toBe(-1);
  });
});

describe("adjustPosition", () => {
  it("collide from bottom", () => {
    const player = {
      box: new Box(new Vector(100, 1), 20, 20),
      speed: new Vector(200, -200)
    };
    const box1 = new Box(new Vector(110, 20), 20, 20);
    const box2 = new Box(new Vector(90, 20), 20, 20);

    const { box, speed } = adjustPlayer(player as Player, [box1, box2]);

    expect(`
pos: ${box.pos.x} ${box.pos.y}
speed: ${speed.x} ${speed.y}
`).toBe(`
pos: 100 0
speed: 200 0
`);
  });
  it("collide from top", () => {
    const player = {
      box: new Box(new Vector(100, 39), 20, 20),
      speed: new Vector(200, -200)
    };
    const box1 = new Box(new Vector(110, 20), 20, 20);
    const box2 = new Box(new Vector(90, 20), 20, 20);

    const { box, speed } = adjustPlayer(player as Player, [box1, box2]);

    expect(`
pos: ${box.pos.x} ${box.pos.y}
speed: ${speed.x} ${speed.y}
`).toBe(`
pos: 100 40
speed: 200 0
`);
  });
  xit("collide from right", () => {
    const player = {
      box: new Box(new Vector(101, 46), 20, 20),
      speed: new Vector(200, -200)
    };
    const box1 = new Box(new Vector(120, 45), 20, 20);
    const box2 = new Box(new Vector(120, 65), 20, 20);

    const { overlapN, overlapV, isCollided } = collideN(player.box, box1, box2);

    const { box, speed } = adjustPlayer(player as Player, [box1, box2]);

    expect(`
pos: ${box.pos.x} ${box.pos.y}
speed: ${speed.x} ${speed.y}
`).toBe(`
pos: 100 46
speed: 0 -200
`);
  });
  xit("collide from right", () => {
    const player = {
      box: new Box(new Vector(99, 46), 20, 20),
      speed: new Vector(200, -200)
    };
    const box1 = new Box(new Vector(80, 45), 20, 20);
    const box2 = new Box(new Vector(80, 65), 20, 20);

    const { overlapN, overlapV, isCollided } = collideN(player.box, box1, box2);

    const { box, speed } = adjustPlayer(player as Player, [box1, box2]);

    expect(`
pos: ${box.pos.x} ${box.pos.y}
speed: ${speed.x} ${speed.y}
`).toBe(`
pos: 100 46
speed: 0 -200
`);
  });
});
