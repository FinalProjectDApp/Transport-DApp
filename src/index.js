import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { DrizzleProvider } from 'drizzle-react'
import { Drizzle, generateStore } from "drizzle";

// Layouts
import App from './App'
import { LoadingContainer } from 'drizzle-react-components'

import { history, store } from './store'
import drizzleOptions from './drizzleOptions'

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <Router history={history} store={store} drizzle={drizzle}>
          <Route exact path="/" component={App} />
        </Router>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
