import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Home from '../src/layouts/trueHome/HomeContainer'
import { isLogin } from '../src/store/actions/auth'


class PrivateRouter extends Component {
    componentDidMount(){
        this.props.isLogin()
    }
    
    render() {
        if(this.props.uid){
            return (
               <Route exact path="/" component={Home}></Route>
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
        isLogin: () => dispatch(isLogin()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRouter);