import { getBoxes, getCoordsFromList } from "../src//parseData";
import { fromModel , fromVector } from '../src/parseData';

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
        tilewidth: 20,
        tiles: {
          "160": {
            animation: [
              {
                duration: 100,
                tileid: 160
              },
              {
                duration: 100,
                tileid: 161
              },
              {
                duration: 100,
                tileid: 162
              },
              {
                duration: 100,
                tileid: 144
              },
              {
                duration: 100,
                tileid: 145
              },
              {
                duration: 100,
                tileid: 146
              }
            ]
          },
          "230": {
            animation: [
              {
                duration: 100,
                tileid: 230
              },
              {
                duration: 100,
                tileid: 231
              },
              {
                duration: 100,
                tileid: 232
              },
              {
                duration: 100,
                tileid: 214
              },
              {
                duration: 100,
                tileid: 215
              },
              {
                duration: 100,
                tileid: 216
              }
            ]
          }
        }
      }
    ],
    tilewidth: 20,
    type: "map",
    version: 1,
    width: 3
  };

  it("map parsed correctly", () => {
    const parsedMap = getBoxes(map);
    expect(parsedMap).toEqual([
      [0, fromModel(fromVector(20, 0), 20, 20)],
      [1, fromModel(fromVector(40, 0), 20, 20)],
      [0, fromModel(fromVector(20, 20), 20, 20)],
      [1, fromModel(fromVector(40, 20), 20, 20)]
    ]);
    expect(parsedMap.length).toBe(4);
    const [firstId, firstBox] = parsedMap[0];
    expect(firstId).toBe(0);
    expect(firstBox.w).toBe(20);
    const [lastId, lastBox] = parsedMap[3];
    expect(`lastId: ${lastId}`).toBe("lastId: 1");
  });
});
