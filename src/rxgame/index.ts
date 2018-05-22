import * as flyd from "flyd";
import { Vector, Box, Response, testPolygonPolygon } from "sat";
import withLatestFrom from "flyd-withlatestfrom";

const keydown = flyd.stream<KeyboardEvent>();
const keyup = flyd.stream<KeyboardEvent>();
const G = 9.8;

const vec = (x: number, y: number) => new Vector(x, y);
const abs = Math.abs;

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#abd5fc";
ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

const collide = (box1: Box, ...boxes: Box[]) => {
  const initialVectors = {
    overlapN: vec(0, 0),
    overlapV: vec(0, 0)
  }
  const collidedBoxes = boxes.filter(box =>
    testPolygonPolygon(box1.toPolygon(), box.toPolygon())
  )
  const isCollided = collidedBoxes.length > 0;
  const vectors = collidedBoxes.reduce((vectors, box) => {
    const res = new Response();
    testPolygonPolygon(box1.toPolygon(), box.toPolygon(), res)
    return {
      overlapN: res.overlapN.add(vectors.overlapN),
      overlapV: res.overlapV.add(vectors.overlapV)
    }
  }, initialVectors);

  return {
    isCollided,
    ...vectors
  };
};

interface State {
  box: Box;
  speed: Vector;
}

const player: State = {
  box: new Box(new Vector(0, 0), 10, 40),
  speed: new Vector()
};

const block: State = {
  box: new Box(new Vector(200, 60), 40, 40),
  speed: new Vector(0, 0)
};

const ground: State = {
  box: new Box(new Vector(0, 100), 500, 100),
  speed: new Vector(0, 0)
};

const updating$ = flyd.stream<number>();

let _spendTime = 0;
const update = time => {
  const tick = (time - _spendTime) / 1000;
  _spendTime = time;
  updating$(tick);
  requestAnimationFrame(update);
};

update(_spendTime);

const cloneBox = ({ pos, w, h }: Box) =>
  new Box(new Vector(pos.x, pos.y), w, h);

const onGround = (player: State, ground: State) => {
  const testBox = cloneBox(player.box);
  testBox.pos.y += 1;
  const { overlapV } = collide(testBox, ground.box, block.box);
  return overlapV.y === 1;
};

const block$ = flyd.stream(block);

const speed$ = flyd.scan(
  (speed, { type, code }) => {
    const { x: vx, y: vy } = speed;
    if (type === "keydown") {
      switch (code) {
        case "ArrowLeft":
          return vec(-200, 0);
        case "ArrowRight":
          return vec(200, 0);
        case "ArrowUp":
          return vec(vx, -300);
        default:
          return speed;
      }
    } else {
      switch (code) {
        case "ArrowLeft":
        case "ArrowRight":
          return vec(0, 0);
        case "ArrowUp":
          return vec(vx, 0);
        default:
          return speed;
      }
    }
  },
  vec(0, 0),
  flyd.merge(keydown, keyup)
);

const moving$ = flyd.scan(
  (player, [timeDelta, { x: speedX, y: speedY }]) => {
    const { speed, box } = player;
    const { x, y } = box.pos;
    const inAir = !onGround(player, ground);
    const newSpeedX = speedX;
    const newSpeedY = inAir ? speed.y + G : speedY;
    const newPlayer = {
      box: new Box(
        new Vector(x + newSpeedX * timeDelta, y + newSpeedY * timeDelta),
        box.w,
        box.h
      ),
      speed: new Vector(newSpeedX, newSpeedY)
    };
    const { overlapN, overlapV, isCollided } = collide(
      newPlayer.box,
      ground.box,
      block$().box
    );
    if (isCollided) {
      newPlayer.box.pos.sub(overlapV);
      const overlapNToSpeed = (overlap: number) => (abs(overlap) === 1 ? 0 : 1);
      newPlayer.speed.scale(
        overlapNToSpeed(overlapN.x),
        overlapNToSpeed(overlapN.y)
      );
    }
    return newPlayer;
  },
  player,
  withLatestFrom([speed$], updating$) as flyd.Stream<[number, Vector]>
);

flyd.on(state => {
  const { box: { pos, w, h } } = state;
  ctx.fillStyle = "#abd5fc";
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.fillStyle = "#333";
  ctx.fillRect(pos.x, pos.y, w, h);
  ctx.fillStyle = "#666";
  ctx.fillRect(
    block$().box.pos.x,
    block$().box.pos.y,
    block$().box.w,
    block$().box.h
  );
  ctx.fillRect(ground.box.pos.x, ground.box.pos.y, ground.box.w, ground.box.h);
}, moving$);
