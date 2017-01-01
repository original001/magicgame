export default class Screen {
  constructor(domCanvas) {
    var canvas = domCanvas;
    this.ctx = canvas.getContext('2d');
  }
  addElements(elements) {
    elements.forEach(elem => {
      const {pos, model, color} = elem;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(pos.x, pos.y, model.w, model.h);
    })
  }
}
