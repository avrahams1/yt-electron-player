import { REMEMBER_PLAYLIST, PLAYLIST_IDS_PROP, readValue, writeValue } from "../../utils/reduxStoreUtils";
import { replace } from "connected-react-router";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { merge, remove, random } from "lodash";
import { loadPlaylistDetails } from "../../utils/googleApiUtils";
import { useMocks } from "Core/config";
import ROUTES from "Constants/routes";

export const loadPlaylistIds = createAsyncThunk(
  "playlists/get",
  getPlaylistIds
)

export const saveIds = createAsyncThunk(
  "playlists/save",
  savePlaylistIds
)

export const loadDetails = createAsyncThunk(
  "playlists/loadDetails",
  loadPlaylistsDetails
)

const playlistPickerSlice = createSlice({
  name: "playlistsPicker",
  initialState: {
    playlistIDs: null,
    playlistDetails: {}
  },
  reducers: {
    addPlaylistId(state, action) {
      state.playlistIDs.push(action.payload);
    },
    removePlaylistID(state, action) {
      remove(state.playlistIDs, id => id === action.payload);
    }
  },
  extraReducers: {
    [loadPlaylistIds.fulfilled]: (state, action) => {
      state.playlistIDs = action.payload;
    },
    [loadDetails.fulfilled]: (state, action) => {
      merge(state.playlistDetails, action.payload);
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
  const { playlistPicker: { playlistIDs } } = getState();

  return writeValue(REMEMBER_PLAYLIST, rememberChoice).then(() =>
    writeValue(PLAYLIST_IDS_PROP, playlistIDs)
  ).then(() => goToPlayerRoute(dispatch));
}

function loadPlaylistsDetails(_, { getState }) {
  const { playlistPicker: { playlistIDs, playlistDetails } } = getState();

  const idsToLoad = playlistIDs.filter(id => !playlistDetails[id]);

  if (idsToLoad.length === 0) return Promise.resolve([]);

  if (useMocks) {
    return new Promise(resolve => {
      setTimeout(() => {
        let dict = {};
  
        idsToLoad.forEach(id => {
          dict[id] = {
            title: id + " playlist",
            itemCount: random(1, 100)
          };
        });
  
        resolve(dict);
      }, random(500, 2500));
    });
  }

  const promises = idsToLoad
    .map(id => {
      return loadPlaylistDetails(id)
        .then(details => {
          const { snippet: { title }, contentDetails: { itemCount } } = details.items[0];

          return {
            id,
            title,
            itemCount,
            success: true
          };
        }).catch(e => {
          return {
            id,
            success: false
          };
        });
    });

  return Promise.all(promises).then(resultsArr => {
    let dict = {};

    resultsArr.forEach(result => {
      const { id, title = '', itemCount = -1, success } = result;
      dict[id] = { success, title, itemCount };
    })

    return dict;
  });
}

function goToPlayerRoute(dispatch) {
  dispatch(replace(ROUTES.PLAYER));
}

export const { addPlaylistId, removePlaylistID } = playlistPickerSlice.actions

export default playlistPickerSlice.reducer;