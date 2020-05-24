import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { debounce } from "lodash";
import { jumpToNextSong } from "Redux/components/player/playerSlice";

const PlayerVideoComponent = ({ currentSong, jumpToNextSong }) => {
  const [ytPlayer, setYtPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    initYTPlayer(setYtPlayer, setIsPlayerReady.bind(undefined, true), jumpToNextSong);
  }, []);

  useEffect(() => {
    if (!currentSong || !isPlayerReady || !ytPlayer) return;
    resizeYTPlayer(ytPlayer);
    ytPlayer.loadVideoById(currentSong.id);
  }, [currentSong, isPlayerReady, ytPlayer])

  useEffect(() => {
    if (!ytPlayer) {
      return;
    }

    window.onresize = debounce(() => resizeYTPlayer(ytPlayer), 500)

    return () => {
      window.onresize = undefined;
    };
  }, [ytPlayer])

  return (
    <div id="ytplayer" />
  );
};

function resizeYTPlayer(ytPlayer) {
  const ratio = 39.0/64.0;
  const parent = document.getElementById("ytplayer").parentElement;
  const { clientWidth: newWidth } = parent;

  const newHeight = newWidth * ratio;

  ytPlayer.setSize(newWidth, newHeight);
}

function initYTPlayer(setYtPlayer, playerReady, jumpToNextSong) {
  const tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady(setYtPlayer, playerReady, jumpToNextSong);
}

function onYouTubeIframeAPIReady(setYtPlayer, playerReady, jumpToNextSong) {
  return () => {
    const ytPlayer = new YT.Player('ytplayer', {
      height: '390',
      width: '640',
      videoId: '8tPnX7OPo0Q',
      playerVars: {
        iv_load_policy: 3  // hide annotations
      },
      events: {
        onReady: playerReady,
        onStateChange: onPlayerStateChange(jumpToNextSong)
      }
    });

    window.onYouTubeIframeAPIReady = undefined;

    setYtPlayer(ytPlayer);
  };
}

function onPlayerStateChange(jumpToNextSong) {
  return (event) => {
    if (event.data === YT.PlayerState.ENDED) {
      jumpToNextSong();
    }
  }
}

const mapStateToProps = (state, props) => ({
  currentSong: state.player.currentSong
});
const mapDispatch = { jumpToNextSong };

export default connect(mapStateToProps, mapDispatch)(PlayerVideoComponent);