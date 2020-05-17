import React from "react";
import { Switch, Route } from "react-router";
import ROUTES from "Constants/routes";
import Welcome from "Pages/main/main";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={ROUTES.MAIN} component={Welcome}></Route>
      </Switch>
    );
  }
}

export default Routes;
