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
import once from "flyd-once";
import zip from "flyd-zip";
import { MyMap } from "../../maps/map";
import { getBoxes, getCoordsFromList, getAnimations } from "./parseData";
import { fromEntity, Entity } from "./fabric";
import { fromTexture } from "../newgame/fabric";
import { contains, apply, inc, update } from "ramda";
import { collideN, onGround, adjustPlayer, collide } from "./collide";
import { vec, sign, next, isVectorsEq, abs, nextByIndex } from "./utils";
import { nextTexture, getAnimationState } from "./animations";
import { arrows$, fireKeys$ } from "./arrows";
import { lazyZip, resetAfter } from "./streamUtils";
import { moveCreature } from "./phisics";
const map: MyMap = require("../../maps/map.json");

const mapsBoxes = getBoxes(map);

const initedMap = mapsBoxes.map(apply(fromEntity));

const playerEntity = initedMap.find(entity => entity.texture === 160);
const enemyEntities = initedMap.filter(entity => entity.texture === 230);
const portalEntities = initedMap.filter(entity => entity.texture === 116);

export const terrains = initedMap.filter(entity =>
  contains(entity.texture, [104, 30, 46])
);

const portals: Portal[] = portalEntities.map((portal, ind, arr) => ({
  ...portal,
  target: nextByIndex(arr, ind).box.pos.clone()
}));

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

const initialPlayer: Player = {
  ...playerEntity,
  speed: vec(),
  dir: vec(1, 0)
};

const player$ = flyd.stream(initialPlayer);

const initialEnemies = enemyEntities.map(
  enemy =>
    ({
      ...enemy,
      speed: vec(),
      dir: vec(1, 0)
    } as Enemy)
);

const enemies$ = flyd.stream(initialEnemies);

const img = document.getElementById("img") as HTMLImageElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const updating$ = flyd.stream<number>();

let _spendTime = 0;
const timer = time => {
  const tick = (time - _spendTime) / 1000;
  _spendTime = time;
  updating$(tick);
  requestAnimationFrame(timer);
};

timer(_spendTime);

const animationInterval$ = flyd.scan(inc, 0, every(120));

const nextPlayerTexture = nextTexture(getAnimations(160, map));
const nextEnemyTexture = nextTexture(getAnimations(230, map));

const playerMoving$ = flyd
  .map(
    ([timeDelta, player, speed, interval]): Player => {
      const newPlayer = moveCreature(player, timeDelta, speed);
      const adjustedPlayer = adjustPlayer(newPlayer, terrains.map(t => t.box));
      return {
        ...adjustedPlayer,
        texture: nextPlayerTexture(
          getAnimationState(adjustedPlayer.dir, adjustedPlayer.speed),
          interval
        )
      };
    },
    withLatestFrom(
      [player$, arrows$, animationInterval$],
      updating$
    ) as flyd.Stream<[number, Player, Vector, number]>
  )
  .map(player => {
    const activePortal = portals.find(
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

const enemyMoving$ = flyd.map(
  ([timeDelta, enemies, speed, interval]) =>
    enemies
      .map(enemy => {
        const newPlayer = moveCreature(enemy, timeDelta, speed);
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
        } as Enemy;
      })
      .map(enemy => {
        const activePortal = portals.find(
          portal => collide(portal.box, enemy.box).isCollided
        );

        if (!activePortal) return enemy;

        const newPlayer = {
          ...enemy,
          box: new Box(
            activePortal.target.clone().add(vec(0, -20)),
            enemy.box.w,
            enemy.box.h
          ),
          speed: vec(enemy.speed.x, -300)
        } as Player;
        return newPlayer;
      }),
  withLatestFrom([enemies$, AI$, animationInterval$], updating$) as flyd.Stream<
    [number, Enemy[], Vector, number]
  >
);

const line$ = (withLatestFrom(
  [playerMoving$, enemyMoving$],
  fireKeys$
) as flyd.Stream<[KeyboardEvent, Player, Enemy[]]>).map(
  ([e, player, enemies]) => {
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
  player$(player);
  enemies$(enemies);
  // }, flyd.combine((player, enemies, line) => [player(), enemies(), line()], [tplayer$, enemyMoving$, line$]));
}, flyd.immediate(lazyZip(playerMoving$, enemyMoving$, resetAfter(100, line$))));
