import React from 'react'
import { reshuffle, jumpToPrevSong, jumpToNextSong, loadPlaylist } from "Redux/components/player/playerSlice";
import { connect, useDispatch } from "react-redux";

import styles from "./player-controls.scss";

const PlayerControlsComponent = ({ currentSong, currentSongIndex, reshuffle, jumpToPrevSong, jumpToNextSong }) => {
  const dispatch = useDispatch();
  const reloadPlaylist = () => dispatch(loadPlaylist(true));

  if (!currentSong) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <span>Current song: </span>
        [{currentSongIndex + 1}] {currentSong.name}
      </div>
      <div className={styles.buttons}>
        <button onClick={jumpToPrevSong}>Previous</button>
        <button onClick={jumpToNextSong}>Next</button>
        <button onClick={reshuffle}>Reshuffle</button>
        <button onClick={reloadPlaylist}>Reload list from YT</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { currentSong, currentSongIndex } = state.player;
  
  return { currentSong, currentSongIndex };
};

const mapDispatch = { reshuffle, jumpToPrevSong, jumpToNextSong };

export default connect(mapStateToProps, mapDispatch)(PlayerControlsComponent);