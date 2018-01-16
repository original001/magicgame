import { createStore, combineReducers } from "redux";
import * as SAT from "sat";
import {parseData} from './parseData'
import {MyMap} from '../../maps/map';
const map: MyMap = require("../../maps/map.json");

const parsedMap = parseData(map)

const reducers = combineReducers({});

const initialState = {};

const store = createStore(reducers, initialState);

store.subscribe(() => {
  //painter
});
