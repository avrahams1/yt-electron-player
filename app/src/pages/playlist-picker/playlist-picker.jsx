import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { get } from "lodash";
import FlexView from 'react-flexview';
import { loadPlaylistIds, saveIds, setIDs } from "Redux/components/playlist-picker/playlistPickerSlice";

import styles from "./playlist-picker.scss";

const PlaylistPicker = ({ playlistIDs, noAutoSkip, setPlaylistIDs }) => {
  const [rememberChoice, setRememberChoice] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaylistIds(noAutoSkip));
  }, []);

  if (!playlistIDs) {
    return <div>Loading...</div>;
  }

  const onValueChanged = event => {
    setPlaylistIDs(event.target.value.split('\n').filter(str => str));
  };

  const onInputChange = event => {
    setRememberChoice(event.target.checked);
  }

  const onClick = () => {
    dispatch(saveIds(rememberChoice));
  }

  const playlistIDsString = playlistIDs.join("\n") + "\n";

  return (
    <FlexView column hAlignContent="center" className={styles.container}>
      <div>Type playlist IDs, seperated by new lines:</div>
      <textarea rows="6" cols="50" value={playlistIDsString} onChange={onValueChanged}></textarea>
      <div>
        <input name="rememberChoices" type="checkbox" checked={rememberChoice} onChange={onInputChange} />
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

export default connect(mapStateToProps, { setPlaylistIDs: setIDs })(PlaylistPicker);