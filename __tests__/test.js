import Creature from '../src/creature';
import SAT from 'sat';
import {satModel} from '../src/satHelpers';

const model = satModel(1, 1, 1, 1);

describe('should', () => {
  it('be true', () => {
    expect(true).toBe(true);
  })
  it('change direction', () => {
    const creature = new Creature(model);
    creature.move('back');
    expect(creature.direction).toBe(-1);
    creature.move('forward');
    expect(creature.direction).toBe(1);
  })
})
