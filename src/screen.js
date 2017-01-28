import SAT from 'sat';

export default class Screen {
  constructor(domCanvas) {
    this.canvas = domCanvas;
    this.ctx = canvas.getContext('2d');
    this.center = new SAT.Vector(canvas.width/2, canvas.height/2);
  }
  addElements(elements, playerPos) {
    this.ctx.fillStyle = '#abd5fc';
    this.ctx.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight, '#abd5fc');
    elements.forEach(elem => {
      const {pos, model, color} = elem;
      const x = pos.x + this.center.x - playerPos.x;
      const y = pos.y + this.center.y - playerPos.y;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, model.w, model.h);
      elem.children.forEach(child => {
        const {pos, model, color} = child;
        const x = pos.x + this.center.x - playerPos.x;
        const y = pos.y + this.center.y - playerPos.y;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, model.w, model.h);
      })
    })
  }
}
