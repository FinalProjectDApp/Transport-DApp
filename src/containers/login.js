import React, { Component } from 'react';
import { connect } from 'react-redux'

import { login, Glogin } from '../store/actions/auth'

class Login extends Component {
    state = {
        email: '',
        password: ''
    }
    emailHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    passwordHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    loginHandler = ()=> {
        this.setState({
            password: ''
        })
        this.props.login(this.state.email, this.state.password)
    }

    render() {
        return (
            <div className="ui container">
                <div className="ui grid centered">
                    <div className="ui five wide column">
                        <div className="ui form">
                            <div className="ui field">
                                <input type="email" placeholder="Email" value={this.state.email} onChange={this.emailHandler} />
                            </div>
                            <div className="ui field">
                                <input type="password" placeholder="Password" value={this.state.password} onChange={this.passwordHandler} />
                            </div>
                            <div className="ui field center">
                                <center>
                                    <button className="ui button centered" onClick={ this.props.GLogin }> Login with Google</button>
                                    <button className="ui button centered" onClick={this.loginHandler} > Login</button>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (email, password) => dispatch(login(email, password)),
        GLogin: () => dispatch(Glogin())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);