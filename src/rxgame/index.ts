import * as flyd from "flyd";
import { Vector, Box, Response, testPolygonPolygon } from "sat";
import withLatestFrom from "flyd-withlatestfrom";
import { MyMap } from "../../maps/map";
import { parseData, getCoordsFromList } from "./parseData";
import { createObjectByTexId, fromEntity, Entity } from "./fabric";
import { fromTexture } from "../newgame/fabric";
import { contains } from "ramda";
import { collideN, onGround, adjustPlayer } from "./collide";
const map: MyMap = require("../../maps/map.json");

const parsedMap = parseData(map);

const initedMap = parsedMap.map(([id, box]) =>
  fromEntity(fromTexture(id), box)
);

const playerEntity = initedMap.find(entity => entity.texture.stat === 160);

export type Player = Entity & {
  speed: Vector;
};

const player: Player = {
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

const img = document.getElementById("img") as HTMLImageElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#abd5fc";
ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

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
    const isOnGround = onGround(player.box, terrains);
    const newSpeedX = speedX;
    const newSpeedY = isOnGround ? speedY : speed.y + G;
    const newPlayer = {
      box: new Box(
        new Vector(x + newSpeedX * timeDelta, y + newSpeedY * timeDelta),
        box.w,
        box.h
      ),
      speed: new Vector(newSpeedX, newSpeedY)
    } as Player;
    const adjustedNewPlayer = adjustPlayer(newPlayer, terrains.map(t => t.box));
    if (player.box.pos.y < 320) {
      console.log("is onGround: " + isOnGround);
      console.log("player: " + player.box.pos);
      console.log("newplayer: " + newPlayer.box.pos);
      console.log("adjustedplayer: " + adjustedNewPlayer.box.pos);
    }
    return adjustedNewPlayer;
  },
  player,
  withLatestFrom([speed$], updating$) as flyd.Stream<[number, Vector]>
);

flyd.on(state => {
  const { box: { pos, w, h } } = state;
  ctx.font = "10px Arial";
  ctx.fillStyle = "#abd5fc";
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.fillStyle = "#333";
  ctx.fillRect(pos.x, pos.y, w, h);
  terrains.forEach(({ box: { pos: { x, y }, w, h }, texture, id }) => {
    // const coord = getCoordsFromList(texture.stat, 16);
    // ctx.drawImage(img, coord.x * 20, coord.y * 20, 20, 20, x, y, w, h)
    ctx.fillStyle = "#666";
    ctx.fillRect(x, y, w, h);
    // ctx.fillStyle = "#fff";
    // ctx.fillText(id.toString(), x + 5, y + 5)
  });
}, moving$);
