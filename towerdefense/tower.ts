import { publish, subscribe } from "pubsub-js";
import { Vector } from "sat";
import { textureMap } from "../src/fabric";
import { Bullet } from "./bullet";
import { Enemy } from "./enemy";
import { Entity } from "./types";

export class Tower implements Entity {
  bullets: Set<Bullet>;
  hasShoot: boolean;
  constructor(public pos: Vector) {
    subscribe("collision.tower", (mes: string, data: { target: Vector }) => {
      if (this.hasShoot) return;

      this.addBullet(data.target);
      this.hasShoot = true;
    });

    subscribe("collision.bullet", (mes: string) => {
      this.hasShoot = false;
    });
  }
  w = 40;
  h = 40;
  readonly texture = textureMap.tower;

  addBullet(target: Vector) {
    publish("addbullet", { pos: this.pos.clone(), speed: target.clone().sub(this.pos).scale(0.5, 0.5) });
  }
}
