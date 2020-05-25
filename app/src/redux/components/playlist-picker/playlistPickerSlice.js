import { PLAYLIST_IDS_PROP, readValue, writeValue } from "../../utils/reduxStoreUtils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

function getPlaylistIds() {
  return readValue(PLAYLIST_IDS_PROP).catch(() => (["PL8wFHI7-y_0w4AShZqurXcJIayFB9_jCa"]));
}

function savePlaylistIds(_, { getState }) {
  return writeValue(PLAYLIST_IDS_PROP, getState().playlistIDs);
}

export const { setIDs } = playlistPickerSlice.actions

export default playlistPickerSlice.reducer;