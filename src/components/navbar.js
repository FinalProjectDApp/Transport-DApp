import React, { Component } from 'react';
import { connect } from 'react-redux'

import { logout } from '../store/actions/auth'

class navbar extends Component {
    render() {
        return (
            <div className="ui container" style={{ margin: '0 auto' }}>
                <div className="ui menu">
                <a className="item">Browse</a>
                <a className="item">Submit</a>
                <div className="right menu">
                    <a className="item" onClick={this.props.logout}>Log Out</a>
                </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.login
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(navbar);