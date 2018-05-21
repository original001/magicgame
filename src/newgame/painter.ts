import * as SAT from 'sat';
import {Entity} from './fabric';
import {getCoordsFromList} from './parseData';
import {forEachObjIndexed} from 'ramda'

export class Painter {
  ctx: CanvasRenderingContext2D;
  center: SAT.Vector;
  img: HTMLImageElement;
  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d');
    this.center = new SAT.Vector(this.canvas.width/2, this.canvas.height/2);
    this.img = document.getElementById('img') as HTMLImageElement;
    this.ctx.fillStyle = '#abd5fc';
    this.ctx.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight, '#abd5fc');
  }
  drawElements(elements: {[id: string]: Entity}, playerPos) {
    this.ctx.fillStyle = '#abd5fc';
    forEachObjIndexed((elem: Entity, id: number) => {
      const {pos, w, h} = elem.object;
      const x = pos.x + this.center.x - playerPos.x;
      const y = pos.y + this.center.y - playerPos.y;
      this.ctx.fillStyle = '#fff';
      const coord = getCoordsFromList(elem.texture.stat, 16);
      if (elem.texture.stat > 0) {
        this.ctx.drawImage(this.img, coord.x * 20, coord.y * 20, 20, 20, x, y, w, h)
      } else {
        this.ctx.fillRect(x, y, w, h, '#fff');
      }
    }, elements)
  }
}
