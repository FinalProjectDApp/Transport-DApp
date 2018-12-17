import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Home from '../src/layouts/trueHome/Home'
import HomeBoss from '../src/layouts/trueHome/HomeBoss'
import { isLogin } from '../src/store/actions/auth'
import firebase from './firebase'

class PrivateRouter extends Component {
    state = {email: ''}
    componentDidMount(){
        this.props.isLogin()
    }
    render() {
        if(this.props.uid){
            if(this.props.uid === '5SXI5MdZ2hfwycJ89zZppRILeBw2') {
                return (
                    <Redirect to={{pathname: '/one'}}/>
                 )
            } else {
                return (
                   <Route exact path="/" component={Home}></Route>
                )
            }
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