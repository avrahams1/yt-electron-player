import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import playerSlice from "../components/player/playerSlice";
import PlaylistsPickerSlice from "../components/playlist-picker/playlistPickerSlice";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    player: playerSlice,
    playlistPicker: PlaylistsPickerSlice
  });

export default createRootReducer;
