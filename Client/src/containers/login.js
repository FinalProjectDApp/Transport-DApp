import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { login, Glogin } from '../store/actions/auth'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    main: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  });

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
        const { classes } = this.props;
        if(this.props.uid){
            return (
            //    <Route exact path="/" component={Home}></Route>
               <Redirect to={{pathname: '/'}}/>
            )
        } else {
            return (
                <main className={classes.main}>
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <img src={require('../assets/Xportein Logo.png')} style={{width: 150}} />
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input id="email" name="email" value={this.state.email} onChange={this.emailHandler} autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input name="password" type="password" id="password" value={this.state.password} onChange={this.passwordHandler} />
                        </FormControl>
                        <Grid container className={classes.root} spacing={16}>
                            <Grid item xs={6}>
                                <Button
                                    onClick={this.loginHandler}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign in
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    onClick={this.props.GLogin}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign in with Google
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </main>
            )
        }
       
    }
}

const mapStateToProps = (state) => {
    console.log('ini state dari login', state);
    
    return {
        uid: state.user.uid
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (email, password) => dispatch(login(email, password)),
        GLogin: () => dispatch(Glogin())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));