import * as flyd from "flyd";
import { Vector, Box, Response, testPolygonPolygon } from "sat";
import withLatestFrom from "flyd-withlatestfrom";

const keydown = flyd.stream<KeyboardEvent>();
const keyup = flyd.stream<KeyboardEvent>();
const G = 9.8;

const vec = (x: number, y: number) => new Vector(x, y);

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#abd5fc";
ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

const collide = (box1: Box, box2: Box): Response => {
  const res = new Response();
  testPolygonPolygon(box1.toPolygon(), box2.toPolygon(), res);
  return res;
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
  box: new Box(new Vector(200, 0), 40, 40),
  speed: new Vector(0, 0)
};

const ground: State = {
  box: new Box(new Vector(0, 100), 500, 100),
  speed: new Vector(0, 0)
};

const moveRight = (timeDelta: number) => ({ box, speed }: State): State => ({
  box: new Box(
    new Vector(box.pos.x + timeDelta * 200, box.pos.y),
    box.w,
    box.h
  ),
  speed
});

const moveLeft = (timeDelta: number) => ({ box, speed }: State): State => ({
  box: new Box(
    new Vector(box.pos.x - timeDelta * 200, box.pos.y),
    box.w,
    box.h
  ),
  speed
});

const gravity = (timeDelta: number) => ({ box, speed }: State): State => ({
  box: new Box(
    new Vector(
      box.pos.x + speed.x * timeDelta,
      box.pos.y - speed.y * timeDelta + G * timeDelta * timeDelta / 2
    ),
    box.w,
    box.h
  ),
  speed: new Vector(speed.x, speed.y - G)
});

const stay = () => (obj: typeof player) => obj;

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
  const res = collide(testBox, ground.box);
  return res.overlapV.y === 1;
};

const block$ = flyd.stream(block);
const speed$ = flyd.merge(keydown, keyup).map(({ type, code }) => {
  if (type === "keydown") {
    switch (code) {
      case "ArrowLeft":
        return vec(-200, 0);
      case "ArrowRight":
        return vec(200, 0);
      case "ArrowUp":
        return vec(0, -200);
    }
  }
  return vec(0, 0);
});

const moving$ = flyd.scan(
  (player, [timeDelta, { x: speedX, y: speedY }]) => {
    const { speed, box } = player;
    const { x, y } = box.pos;
    if (!onGround(player, ground)) {
      speedX = 0;
      speedY = 0;
    }
    const newSpeedY = speedY !== 0 ? speedY : speed.y + G;
    const newPlayer = {
      box: new Box(
        new Vector(x + speedX * timeDelta, y + newSpeedY * timeDelta),
        box.w,
        box.h
      ),
      speed: new Vector(speedX, newSpeedY)
    };
    const res = collide(newPlayer.box, ground.box);
    if (res.overlapV.y > 0) {
      //some weird behavior with nonzero value like 1.15014e+310
      newPlayer.box.pos.sub(res.overlapV);
      newPlayer.speed = vec(0, 0);
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
