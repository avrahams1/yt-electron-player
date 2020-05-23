import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readConfigRequest, readConfigResponse, writeConfigRequest, writeConfigResponse } from "secure-electron-store";
import axios from "axios";

const googleApiToken = "AIzaSyCu5KvidzCYLOY6mP0j9fXVCltfFuvkeGM";

export const loadPlaylistIds = createAsyncThunk(
  "playlists/get",
  getPlaylistIds
)

export const saveIds = createAsyncThunk(
  "playlists/save",
  savePlaylistIds
)

export const loadPlaylist = createAsyncThunk(
  "playlist/get",
  forceRefresh => {
    return getPlaylistIds()
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

const playerSlice = createSlice({
  name: "player",
  initialState: {
    playlistIDs: null,
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
    [saveIds.fulfilled]: (state, action) => {
      state.playlistIDs = action.payload;
    }
  }
})

function loadPlaylistFromMemory(playlistId) {
  return new Promise((resolve, reject) => sendStoreRequestAndRegisterForResponse({ requestType: readConfigRequest, responseType: readConfigResponse, clearBindings: false, cb: args => {
    if (args.success && args.value) {
      resolve(args.value);
    } else {
      reject();
    }
  }}, `playlist-${playlistId}`));
}

function sendStoreRequestAndRegisterForResponse({ requestType, responseType, cb, clearBindings = true }, ...additionalReadParams) {
  if (clearBindings) {
    clearPrevStoreBindings();
  }

  window.api.store.onReceive(responseType, cb);

  window.api.store.send(requestType, ...additionalReadParams);
}

function loadPlaylistFromAPI(listId) {
  // return Promise.resolve([
  //   {
  //     id: "RiFdyPOe3MA" + listId,
  //     name: "TANKS!" + listId
  //   },
  //   {
  //     id: "pKBRx2UYaxM" + listId,
  //     name: "IMAGINE MY SHOCK" + listId
  //   }
  // ]);
  return new Promise(resolve => loadPlaylistChunk({ playlistId: listId, resolve }))
    .then(results => {
      window.api.store.send(writeConfigRequest, `playlist-${listId}`, results);
      return results;
    });
}

function loadPlaylistChunk({ playlistId, resolve, pageToken = "", prevItems = [] }) {
  axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${googleApiToken}&pageToken=${pageToken}`).then(response => {
    const { data: { nextPageToken, items: currItems } } = response;

    let currItemsMapped = currItems.map(item => ({ name: item.snippet.title, id: item.snippet.resourceId.videoId }));
    let totalItems = [...prevItems, ...currItemsMapped];

    if (nextPageToken) {
      loadPlaylistChunk({ playlistId, resolve, pageToken: nextPageToken, prevItems: totalItems });
    } else {
      resolve(totalItems);
    }
  });
}

function savePlaylistIds(ids) {
  return new Promise(resolve => sendStoreRequestAndRegisterForResponse({ requestType: writeConfigRequest, responseType: writeConfigResponse, cb: () => {
    resolve(ids)
  }}, "playlistIds", ids));
}

function getPlaylistIds() {
  return new Promise((resolve, reject) => sendStoreRequestAndRegisterForResponse({ requestType: readConfigRequest, responseType: readConfigResponse, cb: args => {
    if (args.success && args.value) {
      resolve(args.value);
    } else {
      reject();
    }
  }}, "playlistIds"))
  .catch(() => (["PL8wFHI7-y_0w4AShZqurXcJIayFB9_jCa"]));
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
  return Math.floor(Math.random() * (max - min + 1)) + min;
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