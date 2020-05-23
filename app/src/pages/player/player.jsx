import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { loadPlaylist } from "Redux/components/player/playerSlice";
import PlayerVideo from "Components/player-video/player-video";
import PlayerControls from "Components/player-controls/player-controls";
import PlaylistList from "Components/playlist-list/playlist-list";

/*
to debug: --remote-debugging-port=8315
*/

const PlayerComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaylist());
  }, []);

  return (
    <React.Fragment>
      <PlayerVideo />
      <PlayerControls />
      <PlaylistList />
    </React.Fragment>
  );
};

export default connect(null, null)(PlayerComponent);