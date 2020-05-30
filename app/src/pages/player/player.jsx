import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import FlexView from 'react-flexview';
import { loadPlaylist } from "Redux/components/player/playerSlice";
import PlayerVideo from "Components/player-video";
import PlayerControls from "Components/player-controls";
import PlaylistList from "Components/playlist-list";

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
      <FlexView shrink column>
        <PlaylistList />
      </FlexView>
    </FlexView>
  );
};

export default connect(null, null)(PlayerComponent);