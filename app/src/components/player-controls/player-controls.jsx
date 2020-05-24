import React from 'react'
import { connect, useDispatch } from "react-redux";
import FlexView from "react-flexview";
import Tooltip from "react-tooltip-lite";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { BsShuffle } from "react-icons/bs";
import { WiCloudRefresh } from "react-icons/wi";
import { reshuffle, jumpToPrevSong, jumpToNextSong, loadPlaylist } from "Redux/components/player/playerSlice";

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
      <FlexView style={{ justifyContent: "space-between" }} className={styles.buttons}>
        <FlexView>
          <button onClick={jumpToPrevSong}><MdSkipPrevious /></button>
          <button onClick={jumpToNextSong}><MdSkipNext /></button>
        </FlexView>
        <FlexView>
          <Tooltip content="Reshuffle playlist" direction="down"><button onClick={reshuffle}><BsShuffle /></button></Tooltip>
          <Tooltip content="Reload playlist from YT" direction="down"><button onClick={reloadPlaylist}><WiCloudRefresh /></button></Tooltip>
        </FlexView>
      </FlexView>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { currentSong, currentSongIndex } = state.player;

  return { currentSong, currentSongIndex };
};

const mapDispatch = { reshuffle, jumpToPrevSong, jumpToNextSong };

export default connect(mapStateToProps, mapDispatch)(PlayerControlsComponent);