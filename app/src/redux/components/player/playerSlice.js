import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readConfigRequest, readConfigResponse, writeConfigRequest, deleteConfigRequest, deleteConfigResponse } from "secure-electron-store";
import axios from "axios";

const googleApiToken = "AIzaSyCu5KvidzCYLOY6mP0j9fXVCltfFuvkeGM";

export const loadPlaylist = createAsyncThunk(
  "playlist/get",
  forceRefresh => {
    return (forceRefresh ? deleteCachedList() : Promise.resolve())
      .then(loadPlaylistFromMemory)
      .catch(loadPlaylistFromAPI)
      .then(shuffle)
  }
)

const playerSlice = createSlice({
  name: "player",
  initialState: {
    list: null,
    currentSongIndex: null,
    currentSong: null,
    prevSong: null,
    nextSong: null
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
    }
  },
  extraReducers: {
    [loadPlaylist.fulfilled]: (state, action) => {
      state.list = action.payload;
      setCurrentIndex(state, 0);
    }
  }
})

function loadPlaylistFromMemory() {
  return new Promise((resolve, reject) => sendStoreRequestAndRegisterForResponse(readConfigRequest, readConfigResponse, args => {
    if (args.success && args.value) {
      resolve(args.value);
    } else {
      reject();
    }
  }, "playlist"));
}

function deleteCachedList() {
  return new Promise(resolve => sendStoreRequestAndRegisterForResponse(deleteConfigRequest, deleteConfigResponse, resolve));
}

function sendStoreRequestAndRegisterForResponse(requestType, responseType, cb, ...additionalReadParams) {
  clearPrevStoreBindings();

  window.api.store.onReceive(responseType, cb);

  window.api.store.send(requestType, ...additionalReadParams);
}

function loadPlaylistFromAPI() {
  return new Promise(resolve => loadPlaylistChunk({ resolve }))
    .then(results => {
      window.api.store.send(writeConfigRequest, "playlist", results);
      return results;
    });
}

function loadPlaylistChunk({ resolve, pageToken = "", prevItems = [] }) {
  axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PL8wFHI7-y_0w4AShZqurXcJIayFB9_jCa&key=${googleApiToken}&pageToken=${pageToken}`).then(response => {
    const { data: { nextPageToken, items: currItems } } = response;

    let currItemsMapped = currItems.map(item => ({ name: item.snippet.title, id: item.snippet.resourceId.videoId }));
    let totalItems = [...prevItems, ...currItemsMapped];

    if (nextPageToken) {
      loadPlaylistChunk({ resolve, pageToken: nextPageToken, prevItems: totalItems });
    } else {
      resolve(totalItems);
    }
  });
}

function shuffle(list) {
  const copy = [...list];
  let randomizedArray = [];

  while (copy.length) {
    const index = getRandomInRange(0, copy.length - 1);
    randomizedArray.push(copy[index]);
    copy.splice(index, 1);
  }

  return randomizedArray;
}

function clearPrevStoreBindings() {
  window.api.store.clearRendererBindings();
}

function getRandomInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setCurrentIndex(state, newIndex) {
  const { list } = state;
  state.currentSongIndex = newIndex;
  state.currentSong = list[newIndex];
  state.nextSong = list[getNextSongIndex(state)];
  state.prevSong = list[getPrevSongIndex(state)];
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

export const { reshuffle, jumpToPrevSong, jumpToNextSong } = playerSlice.actions;

export default playerSlice.reducer;