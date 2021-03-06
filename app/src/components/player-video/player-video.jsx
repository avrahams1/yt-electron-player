import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { jumpToNextSong } from "Redux/components/player/playerSlice";
import addIframeAPIScriptTag from "./addIframeScriptTag";

const PlayerVideoComponent = ({ currentSong, jumpToNextSong }) => {
  const [ytPlayer, setYtPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    initYTPlayer(setYtPlayer, setIsPlayerReady.bind(undefined, true), jumpToNextSong);
  }, []);

  useEffect(() => {
    if (!currentSong || !isPlayerReady || !ytPlayer) return;
    ytPlayer.loadVideoById(currentSong.id);
  }, [currentSong, isPlayerReady, ytPlayer])

  useEffect(() => {
    if (!currentSong || !isPlayerReady || !ytPlayer) return;

    resizeYTPlayer(ytPlayer);

    const onResize = () => resizeYTPlayer(ytPlayer);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [ytPlayer, isPlayerReady, currentSong])

  return (
    <div id="ytplayer" />
  );
};

function resizeYTPlayer(ytPlayer) {
  const ratio = 39/64;
  const minHeightRatio = 652/771;
  const parent = document.getElementById("ytplayer").parentElement;
  const { clientWidth: newWidth } = parent;

  const newHeight = Math.min(newWidth * ratio, window.innerHeight * minHeightRatio);

  ytPlayer.setSize(newWidth, newHeight);
}

function initYTPlayer(setYtPlayer, playerReady, jumpToNextSong) {
  const onYTAPILoaded = onYouTubeIframeAPIReady(setYtPlayer, playerReady, jumpToNextSong);
  addIframeAPIScriptTag(onYTAPILoaded);
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
        onStateChange: onPlayerStateChange(jumpToNextSong),
        onError: jumpToNextSong
      }
    });

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