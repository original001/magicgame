import { subscribe } from "pubsub-js";
import { Vector } from "sat";
import { Entity } from "./types";

export class Bullet implements Entity {
  constructor(public pos: Vector, public speed: Vector) {
    subscribe("collide", () => {});
  }

  readonly w = 3;
  readonly h = 3;
}
