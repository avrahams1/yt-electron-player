import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import {reducer as toastrReducer} from 'react-redux-toastr'
import playerSlice from "../components/player/playerSlice";
import PlaylistsPickerSlice from "../components/playlist-picker/playlistPickerSlice";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    toastr: toastrReducer,
    player: playerSlice,
    playlistPicker: PlaylistsPickerSlice
  });

export default createRootReducer;
