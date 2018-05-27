export interface MyMap {
  height: number;
  layers: Layer[];
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: TileSet[];
  tilewidth: number;
  type: string;
  version: number;
  width: number;
}
interface Layer {
  data: number[];
  height: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

interface TileSet {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tileproperties: { [id: string]: { instance: number } };
  tilepropertytypes: { [id: string]: { instance: string } };
  tilewidth: number;
  tiles: {
    [id: string]: {
      animation: Animation[];
    };
  };
}

interface Animation {
  duration: number;
  tileid: number;
}
