import * as flyd from "flyd";
import { Vector, Box, Response, testPolygonPolygon } from "sat";
import withLatestFrom from "flyd-withlatestfrom";
import { MyMap } from "../../maps/map";
import { parseData , getCoordsFromList } from "./parseData";
import { createObjectByTexId, fromEntity, Entity } from "./fabric";
import { fromTexture } from "../newgame/fabric";
import { contains } from "ramda";
const map: MyMap = require("../../maps/map.json");

const parsedMap = parseData(map);

const initedMap = parsedMap.map(([id, box]) =>
  fromEntity(fromTexture(id), box)
);

const playerEntity = initedMap.find(entity => entity.texture.stat === 160);

const player = {
  ...playerEntity,
  speed: new Vector()
};

const terrains = initedMap.filter(entity =>
  contains(entity.texture.stat, [104, 30, 46])
);

const keydown = flyd.stream<KeyboardEvent>();
const keyup = flyd.stream<KeyboardEvent>();
const G = 9.8;

const vec = (x: number, y: number) => new Vector(x, y);
const abs = Math.abs;

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const img = document.getElementById('img') as HTMLImageElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#abd5fc";
ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

const collide = (sourceBox: Box, ...entities: Entity[]) => {
  const initialVectors = {
    overlapN: vec(0, 0),
    overlapV: vec(0, 0)
  };
  const collidedBoxes = entities.filter(entity =>
    testPolygonPolygon(sourceBox.toPolygon(), entity.box.toPolygon())
  );
  const isCollided = collidedBoxes.length > 0;
  const vectors = collidedBoxes.reduce((vectors, entity) => {
    const res = new Response();
    testPolygonPolygon(sourceBox.toPolygon(), entity.box.toPolygon(), res);
    return {
      overlapN: res.overlapN.add(vectors.overlapN),
      overlapV: res.overlapV.add(vectors.overlapV)
    };
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

const onGround = (player: State) => {
  const testBox = cloneBox(player.box);
  testBox.pos.y += 1;
  const { overlapV } = collide(testBox, ...terrains);
  return overlapV.y === 1;
};

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
          //todo: note previous direction
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
    const inAir = !onGround(player);
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
      ...terrains
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
  terrains.forEach(({ box: {pos: {x, y}, w, h}, texture }) => {
    // const coord = getCoordsFromList(texture.stat, 16);
    // ctx.drawImage(img, coord.x * 20, coord.y * 20, 20, 20, x, y, w, h)
    ctx.fillRect(x, y, w, h);
  });
}, moving$);
