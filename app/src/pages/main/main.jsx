import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { loadPlaylist } from "Redux/components/player/playerSlice";
import FlexView from 'react-flexview';
import PlayerVideo from "Components/player-video/player-video";
import PlayerControls from "Components/player-controls/player-controls";
import styles from "./main.scss";

/*
to debug: --remote-debugging-port=8315
*/

const MainComponent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(loadPlaylist());
  }, []);

  return (
    <FlexView column hAlignContent="center" className={styles.container}>
      <div className={styles.content}>
        <PlayerVideo />
        <PlayerControls />
      </div>
    </FlexView>
  );
};

export default connect(null, null)(MainComponent);