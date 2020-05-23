import React from "react";
import { readConfigRequest, readConfigResponse, writeConfigRequest, deleteConfigRequest, deleteConfigResponse } from "secure-electron-store";
import axios from "axios";
import styles from "./main.scss";

/*
to debug: --remote-debugging-port=8315
*/

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ytPlayer: null,
      isPlayerReady: false,
      list: [],
      currentSongIndex: -1
    }
  }

  componentDidMount() {
    this.loadIframe();
    this.loadPlaylist();
  }

  loadIframe() {
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const ytPlayer = new YT.Player('ytplayer', {
        height: '390',
        width: '640',
        videoId: '8tPnX7OPo0Q',
        playerVars: {
          iv_load_policy: 3  // hide annotations
        },
        events: {
          onReady: this.onYouTubePlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
        }
      });

      this.setState({ ytPlayer });
    }
  }

  loadPlaylist() {
    this.loadPlaylistFromMemory()
      .catch(() => this.loadPlaylistFromAPI())
      .then(playlist => {
        // Randomize list.
        const copy = [...playlist];
        let randomizedArray = [];

        while (copy.length) {
          const index = this.getRandomArbitrary(0, copy.length - 1);
          randomizedArray.push(copy[index]);
          copy.splice(index, 1);
        }

        this.setState({ list: randomizedArray })
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const { list: currList, currentSongIndex: currCurrSongIndex, ytPlayer, isPlayerReady: currIsPlayerReady } = this.state;
    const { list: prevList, currentSongIndex: prevCurrSongIndex, isPlayerReady: prevIsPlayerReady } = prevState;

    if (currList !== prevList) {
      this.setState({ currentSongIndex: 0 });
    } else if (currIsPlayerReady !== prevIsPlayerReady && currCurrSongIndex !== -1) {
      this.loadSong();
    } else if (currCurrSongIndex !== prevCurrSongIndex && currIsPlayerReady) {
      this.loadSong();
    }
  }

  loadSong() {
    const { list, currentSongIndex, ytPlayer } = this.state;
    ytPlayer.loadVideoById(list[currentSongIndex].id);
  }

  getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  loadPlaylistFromMemory() {
    return new Promise((resolve, reject) => {
      window.api.store.clearRendererBindings()

      window.api.store.onReceive(readConfigResponse, args => {
        if (args.success && args.value) {
          resolve(args.value);
        } else {
          reject();
        }
      });

      window.api.store.send(readConfigRequest, "playlist")
    }).finally(() => window.api.store.clearRendererBindings())
  }

  loadPlaylistFromAPI() {
    return new Promise(resolve => this.loadPlaylistChunk({ resolve }))
      .then(results => {
        window.api.store.send(writeConfigRequest, "playlist", results);
        return results;
      });
  }

  loadPlaylistChunk({ resolve, pageToken = "", prevItems = [] }) {
    axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PL8wFHI7-y_0w4AShZqurXcJIayFB9_jCa&key=AIzaSyCu5KvidzCYLOY6mP0j9fXVCltfFuvkeGM&pageToken=${pageToken}`).then(response => {
      const { data: { nextPageToken, items: currItems } } = response;

      let currItemsMapped = currItems.map(item => ({ name: item.snippet.title, id: item.snippet.resourceId.videoId }));
      let totalItems = [...prevItems, ...currItemsMapped];

      if (nextPageToken) {
        this.loadPlaylistChunk({ resolve, pageToken: nextPageToken, prevItems: totalItems });
      } else {
        resolve(totalItems);
      }
    });
  }

  onYouTubePlayerReady(event) {
    this.setState({ isPlayerReady: true });
  }

  onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      this.next();
    }
  }

  next() {
    const { currentSongIndex, list } = this.state;

    this.setState({ currentSongIndex: (currentSongIndex + 1) % list.length });
  }

  previous() {
    this.setState({ currentSongIndex: this.calcPreviousIndex() });
  }

  calcPreviousIndex() {
    const { currentSongIndex, list } = this.state;

    if (currentSongIndex === 0) {
      return list.length - 1;
    }

    return currentSongIndex - 1;
  }

  refreshList() {
    window.api.store.clearRendererBindings()

    window.api.store.onReceive(deleteConfigResponse, args => {
      this.loadPlaylist();
    }).finally(() => window.api.store.clearRendererBindings());

    window.api.store.send(deleteConfigRequest);
  }

  render() {
    const { currentSongIndex, list } = this.state;

    const prevIndex = this.calcPreviousIndex(),
      nextIndex = (currentSongIndex + 1) % list.length;

    return (
      <div className={styles.container}>
        <div id="ytplayer" />
        {currentSongIndex !== -1 &&
          <div className={styles.textLines}>
            <div>
              Currently playing: {list[currentSongIndex].name}
            </div>
            <div className={styles.controls}>
              <button onClick={this.previous.bind(this)}>Previous</button>
              <button onClick={this.next.bind(this)}>Next</button>
              <button onClick={this.refreshList.bind(this)}>Refresh list from YT</button>
            </div>
            <div>
              Previous song: {list[prevIndex].name}
            </div>
            <div>
              Next song: {list[nextIndex].name}
            </div>
          </div>}
      </div>
    );
  }
}

export default Main;