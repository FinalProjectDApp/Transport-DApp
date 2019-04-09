import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBlHhRqxdE8lpg1aFnozTxzNhzEHChBGdU",
  authDomain: "xportein.firebaseapp.com",
  databaseURL: "https://xportein.firebaseio.com",
  projectId: "xportein",
  storageBucket: "xportein.appspot.com",
  messagingSenderId: "985613506449"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref()

export default firebase;