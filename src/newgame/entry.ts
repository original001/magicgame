import { createStore, combineReducers, compose } from "redux";
import * as SAT from "sat";
import { parseData } from "./parseData";
import { MyMap } from "../../maps/map";
import { createObjectByTexId, Terrain, Creature, Texture } from "./fabric";
import { schema, normalize } from "normalizr";
import { Painter } from "./painter";
const map: MyMap = require("../../maps/map.json");

const parsedMap = parseData(map);

const initedMap = parsedMap.map(([id, box]) => createObjectByTexId(id, box));

const world = {
  terrains: initedMap.filter((item) => item.type === "terrain"),
  players: initedMap.filter((item) => item.type === "player"),
  creatures: initedMap.filter((item) => item.type === "enemy")
};

const terrain = new schema.Entity("terrains");
const player = new schema.Entity("players");
const creature = new schema.Entity("creatures");

interface State {
  entities: {
    terrains: {[id: string]: Terrain};
    creatures: {[id: string]: Creature};
    players: {[id: string]: Creature};
  };
  result: {
    terrains: number[];
    creatures: number[];
    players: number[];
  };
}

const initialState: State = normalize(world, {
  terrains: new schema.Array(terrain),
  players: new schema.Array(player),
  creatures: new schema.Array(creature)
});

const reducers = combineReducers<State>({
  entities: combineReducers({
    terrains: (state = null, a) => state,
    players: (state = null, a) => state,
    creatures: (state = null, a) => state
  }),
  result: (state = [], a) => state
});

const store = createStore(
  reducers,
  initialState,
  compose(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
      : (noop) => noop
  )
);

const painter = new Painter(document.getElementById(
  "canvas"
) as HTMLCanvasElement);

const entities = store.getState().entities;
const centerCamera = entities.players[0].object.pos;

painter.drawElements(
  entities.terrains,
  centerCamera
);

painter.drawElements(
  entities.players,
  centerCamera
);

store.subscribe(() => {
  painter.drawElements(
    entities.terrains,
    centerCamera
  );
  painter.drawElements(
    entities.players,
    centerCamera
  );
});
