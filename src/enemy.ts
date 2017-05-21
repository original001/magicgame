import Creature from './creature';
import {colors} from './spell/fabric';

export default class Enemy extends Creature {
  textureIdsLeft= [214, 214, 215, 215]
  textureIdsRight = [230, 230, 231, 231]

  constructor(model, spellType) {
    super(model, 'black');
    this.enabledSpells = spellType ? [spellType]: [];
    this.movespeed.x = 80;
    this.color = spellType ? colors[this.enabledSpells[0]] : 'black';
  }
}
