import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import playerSlice from "../components/player/playerSlice";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    player: playerSlice
  });

export default createRootReducer;
