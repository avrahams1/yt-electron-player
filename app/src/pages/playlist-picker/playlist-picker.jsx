import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import FlexView from 'react-flexview';
import { push } from "connected-react-router";
import ROUTES from "Constants/routes";
import { loadPlaylistIds, saveIds, setIDs } from "Redux/components/playlist-picker/playlistPickerSlice";

import styles from "./playlist-picker.scss";

const PlaylistPicker = ({ playlistIDs, setPlaylistIDs, push }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaylistIds());
  }, []);

  if (!playlistIDs) {
    return <div>Loading...</div>;
  }

  const onValueChanged = event => {
    setPlaylistIDs(event.target.value.split('\n').filter(str => str));
  };

  const onClick = () => {
    dispatch(saveIds()).then(() => {
      push(ROUTES.PLAYER);
    });
  }

  const playlistIDsString = playlistIDs.join("\n") + "\n";

  return (
    <FlexView column hAlignContent="center" className={styles.container}>
      <div>Type playlist IDs, seperated by new lines:</div>
      <textarea rows="6" cols="50" value={playlistIDsString} onChange={onValueChanged}></textarea>
      <button onClick={onClick}>Play these playlists</button>
    </FlexView>
  )
}

const mapStateToProps = (state, props) => {
  const { playlistIDs } = state.playlistPicker;

  return { playlistIDs };
};

export default connect(mapStateToProps, { push, setPlaylistIDs: setIDs })(PlaylistPicker);