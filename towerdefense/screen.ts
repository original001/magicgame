import { Box } from "sat";
import { textureMap } from "../src/fabric";
import { getCoordsFromList } from "../src/parseData";
import { Entity } from "./types";

export class Screen {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  img: HTMLImageElement;
  constructor() {
    this.img = document.getElementById("img") as HTMLImageElement;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
  }

  render(entities: Entity[]) {
    this.ctx.font = "10px Arial";
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    entities.forEach(({pos, w, h, texture}) => {
      const x = pos.x;
      const y = pos.y;
      this.ctx.fillStyle = "#fff";
      if (!texture) {
        this.ctx.fillRect(x, y, w, h);
        return;
      }
      const coord = getCoordsFromList(texture, 16);
      this.ctx.drawImage(this.img, coord.x * 20, coord.y * 20 + 1, 20, 20, x, y, w, h);
    });
  }
}
