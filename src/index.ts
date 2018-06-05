import * as flyd from "flyd";
import every from "flyd/module/every";
import { Vector, Box } from "sat";
import withLatestFrom from "flyd-withlatestfrom";
import { getBoxes, getCoordsFromList, getAnimations } from "./parseData";
import { fromEntity, Entity } from "./fabric";
import { contains, apply, inc, update, remove } from "ramda";
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
window.addEventListener('keydown', keyPress$)

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
  init(levels[0])
  maps$(levels[0])
  currentLevel = 0;
}, flyd.immediate(start$));

flyd.on(e => {
  if (e.code === 'Escape') {
    $gameplay.style.display = "flex";
  }
}, keyPress$);

flyd.on(_ => {
  if (currentLevel === levels.length - 1) {
    $gameplay.style.display = "flex";
    $win.style.display = 'block';   
    return;
  }
  init(nextByIndex(levels, currentLevel))
  currentLevel++;
}, finishS)

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
    const playerX = player.box.pos.x;
    const playerY = player.box.pos.y;
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
    if (abs(diffX) > .1 || abs(diffY) > .1) {
      x -= diffX * 9 / 10
      y -= diffY * 9 / 10
    }
    return vec(x, y);
  },
  vec(),
  withLatestFrom([maps$], playerMoving$)
);

const line$ = withLatestFrom([playerMoving$, enemyMoving$], fireKeys$).map(
  ([_, player, enemies]) => {
    const foundEnemyIndex = enemies.findIndex(
      enemy =>
        abs(enemy.box.pos.y - player.box.pos.y) < 10 &&
        (enemy.box.pos.x - player.box.pos.x) * player.dir.x > 0
    );
    const foundEnemy = enemies[foundEnemyIndex];
    if (foundEnemy) {
      const from = player.box.pos.clone();
      const to = foundEnemy.box.pos.clone();

      const newPlayer = {
        ...player,
        box: new Box(to.clone(), player.box.w, player.box.h)
      };

      const newEnemy = {
        ...foundEnemy,
        box: new Box(from.clone(), foundEnemy.box.w, foundEnemy.box.h)
      };

      playerMoving$(newPlayer);
      enemyMoving$(update(foundEnemyIndex, newEnemy, enemies));

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
