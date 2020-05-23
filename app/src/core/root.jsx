import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import FlexView from 'react-flexview';
import Routes from "Core/routes";

import styles from "./root.scss";
import "./root.global.scss";

class Root extends React.Component {
  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <FlexView column hAlignContent="center" className={styles.container}>
            <div className={styles.content}>
              <Routes></Routes>
            </div>
          </FlexView>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default Root;