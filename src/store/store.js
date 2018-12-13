import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import user from './reducers/user'

const reducers = combineReducers({
    user
})

const middlewares = applyMiddleware(thunk)

const store = createStore(reducers, middlewares)

export default store 