import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import ReduxToastr from 'react-redux-toastr'
import Routes from "Core/routes";

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

import styles from "./root.scss";
import "./root.global.scss";

class Root extends React.Component {
  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          getState={(state) => state.toastr}
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
          closeOnToastrClick />
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