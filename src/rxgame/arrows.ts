import * as flyd from 'flyd'
import { vec } from './utils';
import filter from "flyd/module/filter";

const keydown = flyd.stream<KeyboardEvent>();
const keyup = flyd.stream<KeyboardEvent>();

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

export const arrows$ = flyd.scan(
  (speed, { type, code }) => {
    const { x: vx, y: vy } = speed;
    if (type === "keydown") {
      switch (code) {
        case "ArrowLeft":
          return vec(-200, 0);
        case "ArrowRight":
          return vec(200, 0);
        case "ArrowUp":
          return vec(vx, -300);
        default:
          return speed;
      }
    } else {
      switch (code) {
        case "ArrowLeft":
          return vec(vx > 0 ? vx : 0, 0);
        case "ArrowRight":
          return vec(vx < 0 ? vx : 0, 0);
        case "ArrowUp":
          return vec(vx, 0);
        default:
          return speed;
      }
    }
  },
  vec(0, 0),
  flyd.merge(keydown, keyup)
);

export const fireKeys$ = filter((e) => e.code === 'KeyF', keydown)
