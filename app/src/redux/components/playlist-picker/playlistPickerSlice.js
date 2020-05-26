import { REMEMBER_PLAYLIST, PLAYLIST_IDS_PROP, readValue, writeValue } from "../../utils/reduxStoreUtils";
import { replace } from "connected-react-router";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ROUTES from "Constants/routes";

export const loadPlaylistIds = createAsyncThunk(
  "playlists/get",
  getPlaylistIds
)

export const saveIds = createAsyncThunk(
  "playlists/save",
  savePlaylistIds
)

const playlistPickerSlice = createSlice({
  name: "playlistsPicker",
  initialState: {
    playlistIDs: null
  },
  reducers: {
    setIDs(state, action) {
      state.playlistIDs = action.payload;
    }
  },
  extraReducers: {
    [loadPlaylistIds.fulfilled]: (state, action) => {
      state.playlistIDs = action.payload;
    }
  }
});

function getPlaylistIds(noAutoSkip, { dispatch }) {
  const basePromise = noAutoSkip ? Promise.reject() : readValue(REMEMBER_PLAYLIST)
  .then(value => {
    if (value) {
      goToPlayerRoute(dispatch);
      return false;
    }

    return Promise.reject();
  });

  return basePromise
    .catch(() => {
      return readValue(PLAYLIST_IDS_PROP).catch(() => (["PL8wFHI7-y_0w4AShZqurXcJIayFB9_jCa"]));
    });
}

function savePlaylistIds(rememberChoice, { getState, dispatch }) {
  const basePromise = rememberChoice ? writeValue(REMEMBER_PLAYLIST, true) : Promise.resolve();
  return basePromise.then(() => 
      writeValue(PLAYLIST_IDS_PROP, getState().playlistIDs)
      .then(() => goToPlayerRoute(dispatch)));
}

function goToPlayerRoute(dispatch) {
  dispatch(replace(ROUTES.PLAYER));
}

export const { setIDs } = playlistPickerSlice.actions

export default playlistPickerSlice.reducer;