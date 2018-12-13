import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Home from './containers/home'

class PrivateRouter extends Component {
    render() {
        if(this.props.uid){
            return (
               <Route exact path="/home" component={Home}></Route>
            )
        } else {
            return (
                <Redirect to={{pathname: '/login'}}/>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        uid: state.user.uid
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRouter);