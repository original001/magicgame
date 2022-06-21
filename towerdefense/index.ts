import { vec } from "../src/utils";
import { Enemy } from "./enemy";
import { WorldMap } from "./map";
import { Screen } from "./screen";
import { Tower } from "./tower";
import { World } from "./world";

function startGame() {
  const enemies = new Set<Enemy>();
  enemies.add(new Enemy(vec(10, 100)));
  enemies.add(new Enemy(vec(-10, 100)));
  const towers = new Set<Tower>();
  towers.add(new Tower(vec(50, 90)))

  new World(new WorldMap(enemies,towers), new Screen());
}

startGame();
