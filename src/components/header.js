import React, { Component } from 'react';
import { connect } from 'react-redux'

// import { isLogin } from '../store/actions/auth'


let headerStyle = {
    width: '100%',
    padding: 20,
    height: 100,
    textAlign: 'center',
    paddingTop: 30
}

class header extends Component {
    // componentDidMount() {
    //     console.log('masuk header');
        
    //     this.props.isLogin()
    // }
    render() {
        return (
            <div className="ui" style={headerStyle} >
                <h1> BLockChain ++</h1>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        // isLogin: () => dispatch(isLogin()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(header);