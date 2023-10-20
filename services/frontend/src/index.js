import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router} from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { ToastProvider } from 'react-toast-notifications';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import MomentUtils from '@date-io/moment';
import './i18n';
import './index.css';
import { ThemeProvider } from '@material-ui/core/styles';
import {theme} from "./MuiTheme";
import { Provider } from 'react-redux';
import {store} from "app/store";
import {MainProvider} from "./components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ShoppingCartProvider} from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  // <Auth0Provider
  //   domain="dev-e0q23bzekeinogff.us.auth0.com"
  //   clientId="anyaLCsRnW3lFnkCR56cWLdMkY9wk8Rn"
  //   authorizationParams={{
  //     redirect_uri: "http://localhost:3000"
  //   }}
  //   >
  <Router>
      <Provider store={store}>
          <Suspense fallback={(<Loader />)}>
              <ThemeProvider theme={theme}>
                  <ToastProvider placement="bottom-right">
                    <ShoppingCartProvider>
                    <MainProvider>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <App/>
                    </MuiPickersUtilsProvider>
                    </MainProvider>
                    </ShoppingCartProvider>
                  </ToastProvider>
              </ThemeProvider>
          </Suspense>
      </Provider>
  </Router>,
  document.getElementById("root")
  // </Auth0Provider>,
);

serviceWorker.unregister();
