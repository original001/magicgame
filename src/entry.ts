import World from './world';
import Screen from './screen';

const screen = new Screen(document.getElementById('canvas'));

new World(screen);
