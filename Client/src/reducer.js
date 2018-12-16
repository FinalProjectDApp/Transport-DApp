import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import user from './store/reducers/user'

const reducer = combineReducers({
  user,
  routing: routerReducer,
  ...drizzleReducers
})

export default reducer
