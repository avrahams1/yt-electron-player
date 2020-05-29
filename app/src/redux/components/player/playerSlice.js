import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { replace } from "connected-react-router";
import { PLAYLIST_IDS_PROP, PLAYLIST_ITEMS_PROP, readValue, writeValue } from "../../utils/reduxStoreUtils";
import { loadPlaylistChunkApi } from "../../utils/googleApiUtils";
import { random } from "lodash";
import { useMocks } from "Core/config";
import ROUTES from "Constants/routes";

export const loadPlaylist = createAsyncThunk(
  "playlist/get",
  forceRefresh => {
    return readValue(PLAYLIST_IDS_PROP)
      .then(ids => {
        const promises = ids.map(id => {
          return (forceRefresh ? Promise.reject() : loadPlaylistFromMemory(id))
            .catch(() => loadPlaylistFromAPI(id))
        });

        return Promise.all(promises);
      })
      .then(resultArrays => {
        const dict = {};
        resultArrays.forEach(arr => {
          arr.forEach(song => {
            dict[song.id] = song;
          })
        });

        return Object.values(dict);
      })
      .then(shuffle);
  }
)

export const goBackToSelectionScreen = createAsyncThunk(
  "playlist/back-to-selection",
  (_, { dispatch }) => {
    dispatch(replace({
      pathname: ROUTES.MAIN,
      state: { noAutoSkip: true }
    }));
  }
)

const playerSlice = createSlice({
  name: "player",
  initialState: {
    list: null,
    currentSongIndex: null,
    currentSong: null,
  },
  reducers: {
    reshuffle(state, action) {
      state.list = shuffle(state.list);
      setCurrentIndex(state, 0);
    },
    jumpToNextSong(state, action) {
      setCurrentIndex(state, getNextSongIndex(state));
    },
    jumpToPrevSong(state, action) {
      setCurrentIndex(state, getPrevSongIndex(state));
    },
    setNewSongIndex(state, action) {
      setCurrentIndex(state, action.payload);
    }
  },
  extraReducers: {
    [loadPlaylist.fulfilled]: (state, action) => {
      state.list = action.payload;
      setCurrentIndex(state, 0);
    },
    [goBackToSelectionScreen.fulfilled]: (state, action) => {
      state.list = null;
      state.currentSong = null;
      state.currentSongIndex = null;
    }
  }
})

function loadPlaylistFromMemory(playlistId) {
  return readValue(PLAYLIST_ITEMS_PROP(playlistId), false);
}

function loadPlaylistFromAPI(listId) {
  if (useMocks) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: "RiFdyPOe3MA" + listId,
            name: "TANKS!" + listId
          },
          {
            id: "pKBRx2UYaxM" + listId,
            name: "IMAGINE MY SHOCK" + listId
          }
        ]);
      }, random(500, 2500));
    });
  }

  return new Promise(resolve => loadPlaylistChunk({ playlistId: listId, resolve }))
    .then(results => {
      return writeValue(PLAYLIST_ITEMS_PROP(listId), results);
    });
}

function loadPlaylistChunk({ playlistId, resolve, pageToken = "", prevItems = [] }) {
  loadPlaylistChunkApi(playlistId, pageToken).then(response => {
    const { nextPageToken, items: currItems } = response;

    let currItemsMapped = currItems.map(item => ({ name: item.snippet.title, id: item.snippet.resourceId.videoId }));
    let totalItems = [...prevItems, ...currItemsMapped];

    if (nextPageToken) {
      loadPlaylistChunk({ playlistId, resolve, pageToken: nextPageToken, prevItems: totalItems });
    } else {
      resolve(totalItems);
    }
  });
}

function shuffle(list) {
  const copy = [...list];
  let randomizedArray = [];

  while (copy.length) {
    const index = random(copy.length - 1);
    randomizedArray.push(copy[index]);
    copy.splice(index, 1);
  }

  return randomizedArray;
}

function setCurrentIndex(state, newIndex) {
  const { list } = state;
  state.currentSongIndex = newIndex;
  state.currentSong = list[newIndex];
}

function getNextSongIndex(state) {
  const { list, currentSongIndex } = state;

  return (currentSongIndex + 1) % list.length;
}

function getPrevSongIndex(state) {
  const { list, currentSongIndex } = state;

  if (currentSongIndex === 0) {
    return list.length - 1;
  }

  return currentSongIndex - 1;
}

export const { reshuffle, jumpToPrevSong, jumpToNextSong, setNewSongIndex } = playerSlice.actions;

export default playerSlice.reducer;