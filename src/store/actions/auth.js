import firebase, { auth, provider } from '../../firebase.js'
import history from '../../history'

export const isLogin = () => {
    return (dispatch) => {
        dispatch({ type: 'LOGIN_LOADING'})
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user);
                
                var uid = user.uid;
                var email = user.email;
                var name = user.displayName;
                // var emailVerified = user.emailVerified;
                // var photoURL = user.photoURL;
                // var isAnonymous = user.isAnonymous;
                // var providerData = user.providerData;
                dispatch({ type: 'LOGIN_SUCCESS', payload: {email: email, uid: uid, name: name}})
                // history.push('/home')
            } else {
                dispatch({ type: 'LOGOUT' })
                history.push('/login')
            }
        });
    }
}

export const login = (email, password) => {    
    return (dispatch) => {
        dispatch({ type: 'LOGIN_LOADING'})
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            dispatch({ type: 'LOGIN_SUCCESS', payload: {email: result.user.email, uid: result.user.uid} })
            history.push('/home')
        }).catch((err) => {
            dispatch({ type: 'LOGIN_ERROR' })
        });
    }
};

export const Glogin = () => {
    return (dispatch) => {
        dispatch({ type: 'LOGIN_LOADING'})
        auth.signInWithPopup(provider) 
        .then((result) => {
            dispatch({ type: 'LOGIN_SUCCESS', payload: {email: result.user.email, uid: result.user.uid} })
            history.push('/home')
        })
        .catch((err) => {
            dispatch({ type: 'LOGIN_ERROR' })
        });
    }
}

export const logout = () => {
    return (dispatch) => {
        auth.signOut()
        .then(() => {            
            dispatch({ type: 'LOGOUT' })
        })
        .catch((err) => {
            console.log(err);
        })
    }
}