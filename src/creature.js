import GravityObject from './gravity.js';
import SAT from 'sat';
import {createSpell} from './spell.js';

export default class Creature extends GravityObject {
  enabledSpells = [];
  isSpellWorking = false;
  movespeed = new SAT.Vector(200, 300);
  move(dir) {
    switch (dir) {
      case 'forward':
        this.speed.x = this.movespeed.x
        break;
      case 'back':
        this.speed.x = -this.movespeed.x
        break;
      case 'up':
        // this.speed.y = this.movespeed.y;
        this.jump(this.movespeed.y);
        break;
    }
  }
  dead() {
    this.pos.x = -100000
  }
  spell(type) {
    const isSpellEnabled = this.enabledSpells.indexOf(type) !== -1;
    if (!isSpellEnabled || this.isSpellWorking) return;

    this.isSpellWorking = true;

    const spell = createSpell(this, type);

    this.children.push(spell);

    spell.promise.then(() => {
      this.isSpellWorking = false;
      const ind = this.children.indexOf(spell);
      this.children.splice(ind, 1);
    })
  }
}