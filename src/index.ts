import * as flyd from "flyd";
import every from "flyd/module/every";
import { Vector, Box } from "sat";
import withLatestFrom from "flyd-withlatestfrom";
import { getBoxes, getCoordsFromList, getAnimations } from "./parseData";
import { fromEntity, Entity } from "./fabric";
import {
  contains,
  apply,
  inc,
  update,
  remove,
  sortBy,
  filter,
  findIndex,
  compose,
  pipe,
  find,
  identity,
  equals,
  lensPath,
  view,
  set
} from "ramda";
import { adjustPlayer, collide } from "./collide";
import { vec, abs, nextByIndex } from "./utils";
import { nextTexture, getAnimationState } from "./animations";
import { arrows$, fireKeys$ } from "./arrows";
import { lazyZip, resetAfter } from "./streamUtils";
import { moveCreature } from "./phisics";
import { MyMap } from "../maps/map";
const map: MyMap = require("../maps/map.json");
const level2: MyMap = require("../maps/level2.json");

type Target = {
  target: Vector;
};

type Portal = Target & Entity;

export type Creature = Entity & {
  speed: Vector;
  dir: Vector;
};

export type Player = Creature;

export type Enemy = Creature;

export type Terrain = Entity;

const eXlens = lensPath(["box", "pos", "x"]);
const eYlens = lensPath(["box", "pos", "y"]);
const eX = view(eXlens) as (e: Entity) => number;
const eY = view(eYlens) as (e: Entity) => number;
const ePoslens = lensPath(["box", "pos"]);
const ePos = view(ePoslens) as (e: Entity) => Vector;
const ePosSet = set(ePoslens);

const img = document.getElementById("img") as HTMLImageElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const start$ = flyd.stream<MouseEvent>();
const keyPress$ = flyd.stream<KeyboardEvent>();

const $start = document.getElementById("start");
const $gameplay = document.getElementById("gameplay");
const $menu = document.getElementById("menu");
const $win = document.getElementById("win");

$start.addEventListener("click", start$);
window.addEventListener("keydown", keyPress$);

const nextPlayerTexture = nextTexture(getAnimations(160, map));
const nextEnemyTexture = nextTexture(getAnimations(230, map));

const player$ = flyd.stream<Player>();
const enemies$ = flyd.stream<Enemy[]>();
const terrains$ = flyd.stream<Terrain[]>();
const portals$ = flyd.stream<Portal[]>();
const maps$ = flyd.stream<MyMap>();
const finishS = flyd.stream();

const levels = [map, level2];

const init = (map: MyMap) => {
  const mapsBoxes = getBoxes(map);

  const initedMap = mapsBoxes.map(apply(fromEntity));

  const playerEntity = initedMap.find(entity => entity.texture === 160);
  const enemyEntities = initedMap.filter(entity => entity.texture === 230);

  const terrains = initedMap.filter(entity =>
    contains(entity.texture, [104, 30, 46, 125])
  );

  const portalEntities = initedMap.filter(entity =>
    contains(entity.texture, [0, 1, 2, 3])
  );

  const portals: Portal[] = portalEntities.map((portal, ind, arr) => ({
    ...portal,
    box: new Box(portal.box.pos.add(vec(0, 10)), 20, 10),
    target: nextByIndex(arr, ind).box.pos.clone()
  }));

  const initialPlayer: Player = {
    ...playerEntity,
    speed: vec(),
    dir: vec(1, 0)
  };

  const initialEnemies = enemyEntities.map(
    enemy =>
      ({
        ...enemy,
        speed: vec(),
        dir: vec(1, 0)
      } as Enemy)
  );

  player$(initialPlayer);
  enemies$(initialEnemies);
  terrains$(terrains);
  portals$(portals);
  // setTimeout(() => {
  //   finishS(true);
  // }, 5000)
};

const updating$ = flyd.stream<number>();

let _spendTime = 0;
const timer = time => {
  const tick = (time - _spendTime) / 1000;
  _spendTime = time;
  updating$(tick);
  requestAnimationFrame(timer);
};

timer(_spendTime);

let currentLevel;

flyd.on(_ => {
  $gameplay.style.display = "none";
  $menu.style.display = "none";
  init(levels[0]);
  maps$(levels[0]);
  currentLevel = 0;
}, start$);

flyd.on(e => {
  if (e.code === "Escape") {
    $gameplay.style.display = "flex";
    $menu.style.display = "block";
  }
}, keyPress$);

flyd.on(_ => {
  if (currentLevel === levels.length - 1) {
    $gameplay.style.display = "flex";
    $win.style.display = "block";
    return;
  }
  const nextLevel = nextByIndex(levels, currentLevel);
  init(nextLevel);
  maps$(nextLevel);
  currentLevel++;
}, finishS);

const animationInterval$ = flyd.scan(inc, 0, every(120));

const playerMoving$ = withLatestFrom(
  [player$, arrows$, animationInterval$, terrains$],
  updating$
)
  .map(
    ([timeDelta, player, speed, interval, terrains]): Player => {
      const newPlayer = moveCreature(player, timeDelta, speed, terrains);
      const adjustedPlayer = adjustPlayer(newPlayer, terrains.map(t => t.box));
      return {
        ...adjustedPlayer,
        texture: nextPlayerTexture(
          getAnimationState(adjustedPlayer.dir, adjustedPlayer.speed),
          interval
        )
      };
    }
  )
  .map(player => {
    const activePortal = portals$().find(
      portal => collide(portal.box, player.box).isCollided
    );

    if (!activePortal) return player;

    const newPlayer = {
      ...player,
      box: new Box(
        activePortal.target.clone().add(vec(0, -20)),
        player.box.w,
        player.box.h
      ),
      speed: vec(player.speed.x, -300)
    } as Player;
    return newPlayer;
  });

const AI$ = flyd
  .scan(inc, 0, every(5000))
  .map(count => (count % 2 === 0 ? vec(-20, 0) : vec(20, 0)));

const enemyMoving$ = withLatestFrom(
  [enemies$, AI$, animationInterval$, terrains$],
  updating$
).map(([timeDelta, enemies, speed, interval, terrains]) =>
  enemies.map(enemy => {
    const newPlayer = moveCreature(enemy, timeDelta, speed, terrains);
    const adjustedPlayer = adjustPlayer(newPlayer, terrains.map(t => t.box));
    return {
      ...adjustedPlayer,
      texture: nextEnemyTexture(
        getAnimationState(adjustedPlayer.dir, adjustedPlayer.speed),
        interval
      )
    } as Enemy;
  })
);

const camera$ = flyd.scan(
  (camera, [player, map]) => {
    const playerX = eX(player);
    const playerY = eY(player)
    let x =
      playerX - canvas.width / 2 <= 0
        ? 0
        : playerX + canvas.width / 2 > map.width * map.tilewidth
          ? canvas.width - map.width * map.tilewidth
          : canvas.width / 2 - playerX;
    let y =
      playerY - canvas.height / 2 <= 0
        ? 0
        : playerY + canvas.height / 2 > map.height * map.tileheight
          ? canvas.height - map.height * map.tileheight
          : canvas.height / 2 - playerY;

    const diffX = x - camera.x;
    const diffY = y - camera.y;
    if (abs(diffX) > 0.1 || abs(diffY) > 0.1) {
      x -= (diffX * 9) / 10;
      y -= (diffY * 9) / 10;
    }
    return vec(x, y);
  },
  vec(),
  withLatestFrom([maps$], playerMoving$)
);

const line$ = withLatestFrom([playerMoving$, enemyMoving$], fireKeys$).map(
  ([_, player, enemies]) => {
    const _diffX = enemy => eX(enemy) - eX(player);
    const _diffY = enemy => eY(enemy) - eY(player);
    const foundEnemy = compose<Enemy[], Enemy[], Enemy[], Enemy>(
      find(enemy => abs(_diffY(enemy)) < 10),
      sortBy(enemy => abs(_diffX(enemy))),
      filter<Enemy>(
        enemy => _diffX(enemy) * player.dir.x > 0 && abs(_diffX(enemy)) < 400
      )
    )(enemies);

    if (foundEnemy) {
      const foundEnemyIndex = findIndex(equals(foundEnemy), enemies);
      const from = player.box.pos.clone();
      const to = foundEnemy.box.pos.clone();

      playerMoving$(ePosSet(to, player));
      enemyMoving$(update(foundEnemyIndex, ePosSet(from, foundEnemy), enemies));

      return [from, to] as [Vector, Vector];
    }
  }
);

flyd.on(([player, enemies, line, camera]) => {
  if (!player || !enemies) return;
  ctx.font = "10px Arial";
  ctx.fillStyle = "#abd5fc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const center = new Vector(canvas.width / 2, (canvas.height * 2) / 3);
  [player, ...enemies, ...terrains$(), ...portals$()].forEach(
    ({ box: { pos, w, h }, texture }) => {
      const x = camera.x + pos.x;
      const y = camera.y + pos.y;
      ctx.fillStyle = "#fff";
      const coord = getCoordsFromList(texture, 16);
      if (texture > 0) {
        //prettier-ignore
        ctx.drawImage( img, coord.x * 20, coord.y * 20 + 1, 20, 20, x, y, w, h);
      } else {
        ctx.fillRect(x, y, w, h);
      }
    }
  );
  if (line) {
    ctx.fillStyle = "#faa";
    ctx.beginPath();
    const [from, to] = line;
    ctx.moveTo(from.x + camera.x + 10, from.y + camera.y + 10);
    ctx.lineTo(to.x + camera.x + 10, to.y + camera.y + 10);
    ctx.stroke();
  }
  player$(player);
  enemies$(enemies);
  // }, flyd.combine((player, enemies, line) => [player(), enemies(), line()], [tplayer$, enemyMoving$, line$]));
}, flyd.immediate(lazyZip(playerMoving$, enemyMoving$, resetAfter(100, line$), camera$)));
