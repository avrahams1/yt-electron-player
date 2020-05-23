import React from 'react'
import { reshuffle, jumpToPrevSong, jumpToNextSong, loadPlaylist } from "Redux/components/player/playerSlice";
import { connect, useDispatch } from "react-redux";

import styles from "./player-controls.scss";

const PlayerControlsComponent = ({ currentSong, prevSong, nextSong, reshuffle, jumpToPrevSong, jumpToNextSong, loadPlaylist }) => {
  const dispatch = useDispatch();
  const reloadPlaylist = () => dispatch(loadPlaylist(true));

  if (!currentSong) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <span>Current song: </span>
        {currentSong.name}
      </div>
      <div className={styles.buttons}>
        <button onClick={jumpToPrevSong}>Previous</button>
        <button onClick={jumpToNextSong}>Next</button>
        <button onClick={reshuffle}>Reshuffle</button>
        <button onClick={reloadPlaylist}>Reload list from YT</button>
      </div>
      <div className={styles.text}>
        <span>Previous song: </span>
        {prevSong.name}
      </div>
      <div className={styles.text}>
        <span>Next song: </span>
        {nextSong.name}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { currentSong, prevSong, nextSong } = state.player;
  
  return { currentSong, prevSong, nextSong };
};

const mapDispatch = { reshuffle, jumpToPrevSong, jumpToNextSong, loadPlaylist };

export default connect(mapStateToProps, mapDispatch)(PlayerControlsComponent);