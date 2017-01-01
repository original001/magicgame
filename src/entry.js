import World from './world.js';
import Screen from './screen.js';

const screen = new Screen(document.getElementById('canvas'));

new World(screen);