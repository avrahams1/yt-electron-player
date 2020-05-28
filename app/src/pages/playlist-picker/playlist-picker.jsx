import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { get } from "lodash";
import FlexView from 'react-flexview';
import { loadPlaylistIds, saveIds } from "Redux/components/playlist-picker/playlistPickerSlice";
import PlaylistList from "Components/playlists-list/playlists-list";

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
      <div>Type playlist IDs, seperated by new lines:</div>
      <PlaylistList />
      <div>
        <input name="rememberChoices" type="checkbox" checked={rememberChoice} onChange={onRememberChanged} />
        <label htmlFor="rememberChoices">Remember this choice?</label>
      </div>
      <button onClick={onClick}>Play these playlists</button>
    </FlexView>
  )
}

const mapStateToProps = (state, props) => {
  const { playlistIDs } = state.playlistPicker;
  const noAutoSkip = get(state, "router.location.state.noAutoSkip", false);

  return { playlistIDs, noAutoSkip };
};

export default connect(mapStateToProps, null)(PlaylistPicker);