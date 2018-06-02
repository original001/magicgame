import * as flyd from "flyd";
import every from "flyd/module/every";
import lift from "flyd/module/lift";
import filter from "flyd/module/filter";
import scanmerge from "flyd/module/scanmerge";
import mergeall from "flyd/module/mergeall";
import inlast from "flyd/module/inlast";
import { Vector, Box, Response, testPolygonPolygon } from "sat";
import withLatestFrom from "flyd-withlatestfrom";
import buffer from "flyd-buffercount";
import zip from "flyd-zip";
import { MyMap } from "../../maps/map";
import { getBoxes, getCoordsFromList, getAnimations } from "./parseData";
import { fromEntity, Entity } from "./fabric";
import { fromTexture } from "../newgame/fabric";
import { contains, apply, any, equals, indexOf, curryN, inc } from "ramda";
import { collideN, onGround, adjustPlayer } from "./collide";
import { vec, sign, next, isVectorsEq, abs } from "./utils";
import { nextTexture, getAnimationState } from "./animations";
import { arrows$, fireKeys$ } from "./arrows";
const map: MyMap = require("../../maps/map.json");

const mapsBoxes = getBoxes(map);

const initedMap = mapsBoxes.map(apply(fromEntity));

const playerEntity = initedMap.find(entity => entity.texture === 160);
const enemyEntities = initedMap.filter(entity => entity.texture === 230);
const portalEntities = initedMap.filter(entity => entity.texture === 116);
const terrains = initedMap.filter(entity =>
  contains(entity.texture, [104, 30, 46])
);

export type Creature = Entity & {
  speed: Vector;
  dir: Vector;
};

export type Player = Creature;

export type Enemy = Creature;

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

const G = 9.8;

const img = document.getElementById("img") as HTMLImageElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const updating$ = flyd.stream<number>();

let _spendTime = 0;
const update = time => {
  const tick = (time - _spendTime) / 1000;
  _spendTime = time;
  updating$(tick);
  requestAnimationFrame(update);
};

update(_spendTime);

const animationInterval$ = flyd.scan(inc, 0, every(120));

const nextPlayerTexture = nextTexture(getAnimations(160, map));
const nextEnemyTexture = nextTexture(getAnimations(230, map));

const nextPosition = (
  creature: Creature,
  timeDelta,
  { x: speedX, y: speedY }
): Creature => {
  const { speed, box } = creature;
  const { x, y } = box.pos;
  const isOnGround = onGround(creature.box, terrains.map(t => t.box));
  const newSpeedX = speedX;
  const newSpeedY = isOnGround ? speedY : speed.y + G;
  const newCreature = {
    ...creature,
    box: new Box(
      new Vector(x + newSpeedX * timeDelta, y + newSpeedY * timeDelta),
      box.w,
      box.h
    ),
    speed: new Vector(newSpeedX, newSpeedY)
  };
  return newCreature;
};

const playerMoving$ = flyd.scan(
  (player, [timeDelta, speed, interval]) => {
    const newPlayer = nextPosition(player, timeDelta, speed);
    const adjustedPlayer = adjustPlayer(newPlayer, terrains.map(t => t.box));
    return {
      ...adjustedPlayer,
      texture: nextPlayerTexture(
        getAnimationState(adjustedPlayer.dir, adjustedPlayer.speed),
        interval
      )
    };
  },
  initialPlayer,
  withLatestFrom([arrows$, animationInterval$], updating$) as flyd.Stream<
    [number, Vector, number]
  >
);

const enemyArrows$ = flyd
  .scan(inc, 0, every(5000))
  .map(count => (count % 2 === 0 ? vec(-20, 0) : vec(20, 0)));

const enemyMoving$ = zip(
  initialEnemies.map(initialEnemy =>
    flyd.scan(
      (enemy, [timeDelta, speed, interval]) => {
        const newPlayer = nextPosition(enemy, timeDelta, speed);
        const adjustedPlayer = adjustPlayer(
          newPlayer,
          terrains.map(t => t.box)
        );
        return {
          ...adjustedPlayer,
          texture: nextEnemyTexture(
            getAnimationState(adjustedPlayer.dir, adjustedPlayer.speed),
            interval
          )
        };
      },
      initialEnemy,
      withLatestFrom(
        [enemyArrows$, animationInterval$],
        updating$
      ) as flyd.Stream<[number, Vector, number]>
    )
  )
);

const line$ = (withLatestFrom(
  [playerMoving$, enemyMoving$],
  fireKeys$
) as flyd.Stream<[KeyboardEvent, Player, Enemy[]]>).map(
  ([e, player, enemies]) => {
    const foundEnemy = enemies.find(
      enemy => abs(enemy.box.pos.y - player.box.pos.y) < 10 &&
        (enemy.box.pos.x - player.box.pos.x) * player.dir.x > 0
    );

    if (foundEnemy) {
      const line = [
        player.box.pos.clone().add(vec(10, 10)),
        foundEnemy.box.pos.clone().add(vec(10, 10))
      ] as [Vector, Vector];
      return line;
    }
  }
);

let timeout;
const debouncedLine$ = flyd.combine((line, self) => {
  if (line.hasVal) {
    clearTimeout(timeout);
    timeout = setTimeout(() => self(undefined), 200)
  }
  return line()
}, [line$]) as flyd.Stream<[Vector, Vector]>

flyd.on(([player = initialPlayer, enemies = initialEnemies, line]) => {
  ctx.font = "10px Arial";
  ctx.fillStyle = "#abd5fc";
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  const center = new Vector(canvas.width / 2, canvas.height * 2 / 3);
  [player, ...enemies, ...terrains, ...portalEntities].forEach(
    ({ box: { pos, w, h }, texture, id }) => {
      const x = pos.x + center.x - player.box.pos.x;
      const y = pos.y + center.y - player.box.pos.y;
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
    ctx.moveTo(
      from.x + center.x - player.box.pos.x,
      from.y + center.y - player.box.pos.y
    );
    ctx.lineTo(
      to.x + center.x - player.box.pos.x,
      to.y + center.y - player.box.pos.y
    );
    ctx.stroke();
  }
}, flyd.immediate(flyd.combine((player, enemies, line) => [player(), enemies(), line()], [playerMoving$, enemyMoving$, debouncedLine$]) as flyd.Stream<[Player, Enemy[], [Vector, Vector]]>));
