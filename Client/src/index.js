import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router'
import { DrizzleProvider } from 'drizzle-react'
import { Drizzle, generateStore } from "drizzle";
import { Provider } from 'react-redux'
import PrivateRoute from './privateRoute'
import historyy from '../src/history'


// Layouts
// import App from './App'
import { LoadingContainer } from 'drizzle-react-components'
import Home from './layouts/trueHome/Home'
import HomeBoss from './layouts/trueHome/HomeBoss'
import Particles from 'react-particles-js';

// import Header from '../src/components/header'
import login from '../src/containers/login'
import { history, store } from './store'
import drizzleOptions from './drizzleOptions'

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render((
  <Fragment>
     <div
          style={{
            backgroundColor: 'rgb(250, 250, 250)',
            padding: 0,
            margin: 0,
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1
          }}
        >
          <Particles
            params={{
              "particles": {
                "number": {
                  "value": 137,
                  "density": {
                    "enable": false,
                    "value_area": 1000
                  }
                },
                "color": {
                  "value": ["#e40045", "#58636d"]
                },
                "shape": {
                  "type": "polygon",
                  "stroke": {
                    "width": 0,
                    "color": "#000000"
                  },
                  "polygon": {
                    "nb_sides": 4
                  }
                },
                "size": {
                  "value": 5,
                  "random": true,
                  "anim": {
                    "enable": false,
                    "speed": 4,
                    "size_min": 1,
                    "sync": false
                  }
                },
                "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#58636d",
                  "opacity": 0.4,
                  "width": 1
                },
                "move": {
                  "enable": true,
                  "speed": 5,
                  "direction": "none",
                  "random": true,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                  }
                }
              },
              "interactivity": {
                "detect_on": "window",
                "events": {
                  "onhover": {
                    "enable": true,
                    "mode": "repulse"
                  },
                  "onclick": {
                    "enable": true,
                    "mode": "grab"
                  },
                  "resize": true
                },
                "modes": {
                  "grab": {
                    "distance": 200,
                    "line_linked": {
                      "opacity": 1
                    }
                  },
                  "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                  },
                  "repulse": {
                    "distance": 200,
                    "duration": 0.4
                  },
                  "push": {
                    "particles_nb": 4
                  },
                  "remove": {
                    "particles_nb": 2
                  }
                }
              },
              "retina_detect": true
            }}
          />
        </div>
    <DrizzleProvider options={drizzleOptions}>
      <LoadingContainer>
        <Provider store={store} >
          <Router historyy={historyy} history={history} drizzle={drizzle}>
            <Switch>
              {/* <Header></Header> */}
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/login" component={login} />
              <Route exact path="/one" component={HomeBoss} />
            </Switch>
          </Router>
        </Provider>
      </LoadingContainer>
    </DrizzleProvider>
  </Fragment>
  ),
  document.getElementById('root')
);
