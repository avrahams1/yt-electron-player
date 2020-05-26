import React from 'react'
import { connect, useDispatch } from "react-redux";
import { replace } from "connected-react-router";
import ROUTES from "Constants/routes";
import FlexView from "react-flexview";
import Tooltip from "react-tooltip-lite";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { BsShuffle, BsMusicNoteList } from "react-icons/bs";
import { WiCloudRefresh } from "react-icons/wi";
import { reshuffle, jumpToPrevSong, jumpToNextSong, loadPlaylist } from "Redux/components/player/playerSlice";

import styles from "./player-controls.scss";

const PlayerControlsComponent = ({ currentSong, currentSongIndex, list, reshuffle, jumpToPrevSong, jumpToNextSong }) => {
  const dispatch = useDispatch();
  const reloadPlaylist = () => dispatch(loadPlaylist(true));

  if (!currentSong) {
    return <div>Loading...</div>;
  }

  const backToMainScreen = () => {
    dispatch(replace({
      pathname: ROUTES.MAIN,
      state: { noAutoSkip: true }
    }));
  };

  const positionInList = `${currentSongIndex + 1} / ${list.length}`;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.placeInList}>[{positionInList}]</span>
        <span className={styles.title}>{currentSong.name}</span>
      </div>
      <FlexView style={{ justifyContent: "space-between" }} className={styles.buttons}>
        <FlexView>
          <button onClick={jumpToPrevSong}><MdSkipPrevious /></button>
          <button onClick={jumpToNextSong}><MdSkipNext /></button>
        </FlexView>
        <FlexView>
          <Tooltip content="Back to playlist selection screen" direction="left" background="black" color="white"><button onClick={backToMainScreen}><BsMusicNoteList /></button></Tooltip>
          <Tooltip content="Reshuffle playlist" direction="left" background="black" color="white"><button onClick={reshuffle}><BsShuffle /></button></Tooltip>
          <Tooltip content="Reload playlist from YT" direction="right" background="black" color="white"><button onClick={reloadPlaylist}><WiCloudRefresh /></button></Tooltip>
        </FlexView>
      </FlexView>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { currentSong, currentSongIndex, list } = state.player;

  return { currentSong, currentSongIndex, list };
};

const mapDispatch = { reshuffle, jumpToPrevSong, jumpToNextSong };

export default connect(mapStateToProps, mapDispatch)(PlayerControlsComponent);