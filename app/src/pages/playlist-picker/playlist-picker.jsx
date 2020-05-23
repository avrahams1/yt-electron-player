import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit'
import { push } from "connected-react-router";
import ROUTES from "Constants/routes";
import { loadPlaylistIds, saveIds } from "Redux/components/player/playerSlice";

const PlaylistPicker = ({ push }) => {
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPlaylistIds()).then(result => {
      const ids = unwrapResult(result);
      setValue(ids.join('\n'));
    });
  }, []);

  if (!value) {
    return <div>Loading...</div>;
  }

  const onValueChanged = event => {
    setValue(event.target.value);
  };

  const onClick = () => {
    const ids = value.split('\n').filter(str => str && str.length > 10);
    dispatch(saveIds(ids)).then(() => {
      push(ROUTES.PLAYER);
    });
  }

  return (
    <React.Fragment>
      <div>Type playlist IDs, seperated by new lines:</div>
      <textarea rows="6" cols="50" value={value} onChange={onValueChanged}></textarea>
      <button onClick={onClick}>Play these playlists</button>
    </React.Fragment>
  )
}

export default connect(null, { push })(PlaylistPicker);