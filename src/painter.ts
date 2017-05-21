import SAT from 'sat';
import WorldObject from './base';

export default class Painter {
  ctx: CanvasRenderingContext2D;
  center: SAT.Vector;
  img: HTMLImageElement;
  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d');
    this.center = new SAT.Vector(this.canvas.width/2, this.canvas.height/2);
    this.img = document.getElementById('img') as HTMLImageElement;
  }
  drawElements(elements: WorldObject[], playerPos) {
    this.ctx.fillStyle = '#abd5fc';
    this.ctx.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight, '#abd5fc');
    elements.forEach(function draw(elem) {
      const {pos, model, color} = elem;
      const x = pos.x + this.center.x - playerPos.x;
      const y = pos.y + this.center.y - playerPos.y;
      this.ctx.fillStyle = color;
      const texId = elem.textureId;
      const rows = Math.floor(texId / 16);
      const sx = texId - rows * 16
      if (elem.textureId > 0) {
        this.ctx.drawImage(this.img, sx * 20, rows * 20, 20, 20, x, y, model.w, model.h)
      } else {
        this.ctx.fillRect(x, y, model.w, model.h);
      }
      if (elem.children.length > 0) {
        elem.forEach(draw.bind(this));
      }
    }.bind(this))
  }
}
