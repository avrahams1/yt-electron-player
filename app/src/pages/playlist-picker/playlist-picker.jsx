import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { get } from "lodash";
import FlexView from 'react-flexview';
import { loadPlaylistIds, saveIds } from "Redux/components/playlist-picker/playlistPickerSlice";
import PlaylistList from "Components/playlists-list";

import styles from "./playlist-picker.scss";

const PlaylistPicker = ({ playlistIDs, noAutoSkip }) => {
  const [rememberChoice, setRememberChoice] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaylistIds(noAutoSkip));
  }, []);

  if (!playlistIDs) {
    return <div>Loading...</div>;
  }

  const onRememberChanged = event => {
    setRememberChoice(event.target.checked);
  }

  const onClick = () => {
    dispatch(saveIds(rememberChoice));
  }

  return (
    <FlexView column hAlignContent="center" className={styles.container}>
      <PlaylistList />
      <div>
        <input name="rememberChoices" type="checkbox" checked={rememberChoice} onChange={onRememberChanged} />
        <label htmlFor="rememberChoices">Remember this choice?</label>
      </div>
      <button onClick={onClick} disabled={playlistIDs.length === 0}>Play these playlists</button>
    </FlexView>
  )
}

const mapStateToProps = (state, props) => {
  const { playlistIDs } = state.playlistPicker;
  const noAutoSkip = get(state, "router.location.state.noAutoSkip", false);

  return { playlistIDs, noAutoSkip };
};

export default connect(mapStateToProps, null)(PlaylistPicker);