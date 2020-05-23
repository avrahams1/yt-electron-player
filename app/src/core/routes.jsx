import React from "react";
import { Switch, Route } from "react-router";
import ROUTES from "Constants/routes";
import Player from "Pages/player/player";
import PlaylistPicker from "Pages/playlist-picker/playlist-picker";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.MAIN} component={PlaylistPicker} />
        <Route exact path={ROUTES.PLAYER} component={Player}></Route>
      </Switch>
    );
  }
}

export default Routes;
