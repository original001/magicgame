import { subscribe } from "pubsub-js";
import { Vector } from "sat";
import { textureMap } from "../src/fabric";
import { vec } from "../src/utils";
import { Entity } from "./types";

export class Enemy implements Entity {
  constructor(public pos: Vector) {
    subscribe("collide", () => {});
  }
  w = 20;
  h = 20;
  lives = 100;
  speed: Vector = vec(10, 0);
  texture = textureMap.enemy;
}
