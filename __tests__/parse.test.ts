import { parseData, getCoordsFromList } from "../src/newgame/parseData";
import { fromModel, fromVector, fromBox } from "../src/newgame/satHelpers";
import * as SAT from "sat";

describe("parsing map", () => {
  it("getting coord from flat list correctly", () => {
    const coord = getCoordsFromList(5, 4);
    expect(coord.x).toBe(1);
    expect(coord.y).toBe(1);
  });

  const map = {
    height: 25,
    layers: [
      {
        data: [0, 1, 2, 0, 1, 2],
        height: 25,
        name: "Tile Layer 1",
        opacity: 1,
        type: "tilelayer",
        visible: true,
        width: 200,
        x: 0,
        y: 0
      }
    ],
    nextobjectid: 1,
    orientation: "orthogonal",
    renderorder: "left-up",
    tiledversion: "1.0.3",
    tileheight: 20,
    tilesets: [
      {
        columns: 16,
        firstgid: 1,
        image: "../img/terrain.png",
        imageheight: 320,
        imagewidth: 320,
        margin: 0,
        name: "terrain",
        spacing: 0,
        tilecount: 256,
        tileheight: 20,
        tileproperties: {},
        tilepropertytypes: {},
        tilewidth: 20
      }
    ],
    tilewidth: 20,
    type: "map",
    version: 1,
    width: 3 
  };

  it("map parsed correctly", () => {
    const parsedMap = parseData(map);
    expect(parsedMap).toEqual([
      [0, fromBox(20, 0, 20, 20)],
      [1, fromBox(40, 0, 20, 20)],
      [0, fromBox(20, 20, 20, 20)],
      [1, fromBox(40, 20, 20, 20)]
    ]);
    expect(parsedMap.length).toBe(4);
    const [firstId, firstBox] = parsedMap[0];
    expect(firstId).toBe(0);
    expect(firstBox.w).toBe(20);
    const [lastId, lastBox] = parsedMap[3];
    expect(`lastId: ${lastId}`).toBe("lastId: 1");
  });
});
