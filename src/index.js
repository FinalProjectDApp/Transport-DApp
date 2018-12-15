import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router'
import { DrizzleProvider } from 'drizzle-react'
import { Drizzle, generateStore } from "drizzle";
import { Provider } from 'react-redux'
import PrivateRoute from './privateRoute'
import historyy from '../src/history'


// Layouts
import App from './App'
import { LoadingContainer } from 'drizzle-react-components'
import HomeContainer from './layouts/trueHome/HomeContainer'

import Header from '../src/components/header'
import login from '../src/containers/login'
import { history, store } from './store'
import drizzleOptions from './drizzleOptions'

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions}>
      <LoadingContainer>
        <Provider store={store} >
          <Router historyy={historyy} history={history} drizzle={drizzle}>
            <Switch>
              {/* <Header></Header> */}
              <PrivateRoute exact path="/" component={HomeContainer} />
              <Route exact path="/login" component={login} />
            </Switch>
          </Router>
        </Provider>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
