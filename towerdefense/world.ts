import { WorldMap } from "./map";
import { publish, subscribe } from "pubsub-js";
import { Screen } from "./screen";
import { Box, testPolygonPolygon } from "sat";
import { Entity } from "./types";

export class World {
  constructor(private worldMap: WorldMap, private screen: Screen) {
    setInterval(() => {
      this.tick();
    }, 1000);
  }

  tick() {
    this.updatePositions();
    this.calcCollisions();
    this.screen.render(
      Array.from<Entity>(this.worldMap.enemies)
        .concat(Array.from(this.worldMap.towers))
        .concat(Array.from(this.worldMap.bullets))
    );
    console.log(Array.from(this.worldMap.bullets)[0]?.pos)
  }
  updatePositions() {
    this.worldMap.enemies.forEach((a, enemy) => {
      enemy.pos.add(enemy.speed);
    });
    this.worldMap.bullets.forEach((a, bullet) => {
      bullet.pos.add(bullet.speed);
    });
  }

  calcCollisions() {
    this.worldMap.towers.forEach((tower) => {
      const towerBox = new Box(tower.pos, tower.w, tower.h);
      this.worldMap.enemies.forEach((enemy) => {
        const enemyBox = new Box(enemy.pos, enemy.w, enemy.h);
        const hasCollided = testPolygonPolygon(towerBox.toPolygon(), enemyBox.toPolygon());
        if (hasCollided) {
          publish("collision.tower", { target: enemy.pos });
        }
      });
    });
  }
}
