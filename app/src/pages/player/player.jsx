import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import FlexView from 'react-flexview';
import { loadPlaylist } from "Redux/components/player/playerSlice";
import PlayerVideo from "Components/player-video/player-video";
import PlayerControls from "Components/player-controls/player-controls";
import PlaylistList from "Components/playlist-list/playlist-list";

import styles from "./player.scss";

/*
to debug: --remote-debugging-port=8315
*/

const PlayerComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaylist());
  }, []);

  return (
    <FlexView vAlignContent="center" style={{ justifyContent: "space-between" }}>
      <FlexView grow marginRight="50px" column>
        <PlayerVideo />
        <PlayerControls />
      </FlexView>
      <FlexView column className={styles.listContainer}>
        <PlaylistList />
      </FlexView>
    </FlexView>
  );
};

export default connect(null, null)(PlayerComponent);