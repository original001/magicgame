export default class Enemy extends GravityObject {
  constructor(x, y) {
    super(x, y, 20, 50, 'black');
  }
  dead() {
    this.pos.x = -100000
  }
  collide(obj, res) {
    super.collide(obj, res);
    if (obj instanceof Player) {
      if (Math.abs(res.overlapN.y) > 0) {
        this.dead();
      }
    }
  }
}
