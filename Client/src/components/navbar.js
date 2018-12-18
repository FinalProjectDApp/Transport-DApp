import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


import { logout } from '../store/actions/auth'


const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };
  

class navbar extends Component {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <img src={require('../assets/Xportein Logo.png')} style={{height: 70, marginRight: 'auto'}} />
                    <Button color="inherit" onClick={this.props.logout}>Logout</Button>
                </Toolbar>
            </AppBar>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(navbar));