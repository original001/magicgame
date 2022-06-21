import { Vector } from "sat";

export interface Entity {
  speed?: Vector;
  texture?: number;
  w: number;
  h: number;
  pos: Vector;
}
