import { Enemy } from "./enemy";
import { Tower } from "./tower";
import { Vector } from "sat";
import { subscribe } from "pubsub-js";
import { Bullet } from "./bullet";

export class WorldMap {
  bullets: Set<Bullet>;
  constructor(public enemies: Set<Enemy>, public towers: Set<Tower>) {
    subscribe("addbullet", (mes: string, data: { pos: Vector; speed: Vector }) => {
      const { pos, speed } = data;
      this.addBullet(pos, speed);
    });
    this.bullets = new Set();
  }
  addBullet(pos: Vector, speed: Vector) {
    this.bullets.add(new Bullet(pos, speed));
  }
  path: Vector[];
}
