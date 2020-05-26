import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import Routes from "Core/routes";

import styles from "./root.scss";
import "./root.global.scss";

class Root extends React.Component {
  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className={styles.container}>
              <Routes></Routes>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default Root;