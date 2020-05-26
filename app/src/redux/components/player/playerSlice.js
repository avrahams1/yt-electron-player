import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PLAYLIST_IDS_PROP, PLAYLIST_ITEMS_PROP, readValue, writeValue } from "../../utils/reduxStoreUtils";
import axios from "axios";

const googleApiToken = "AIzaSyCu5KvidzCYLOY6mP0j9fXVCltfFuvkeGM";

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
    }
  }
})

function loadPlaylistFromMemory(playlistId) {
  return readValue(PLAYLIST_ITEMS_PROP(playlistId), false);
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
      return writeValue(PLAYLIST_ITEMS_PROP(listId), results);
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