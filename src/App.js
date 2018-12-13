import React, { Component } from 'react'
import { Router, Switch, Route } from 'react-router-dom';

import { Provider } from 'react-redux'

import Home from './containers/home'
import Header from './components/header'
import store from './store/store'
import history from './history'
import PrivateRoute from './privateRoute'
import Login from './containers/login'
// import HomeContainer from './layouts/home/HomeContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Router history={history}>
            <div>
              <Header></Header>
              <Switch>
                <PrivateRoute exact path="/home" component={Home} ></PrivateRoute>
                <Route exact path="/login" component={Login} ></Route>
                {/* <Route exact path="/" component={HomeContainer}/> */}
              </Switch>
            </div>
          </Router>
        </Provider>

      </div>
    );
  }
}

export default App
