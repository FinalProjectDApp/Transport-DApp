import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyCz3ckgFrWt6inJVdW93hL2__Sh3boef-E",
    authDomain: "blogcoffee-220123.firebaseapp.com",
    databaseURL: "https://blogcoffee-220123.firebaseio.com",
    projectId: "blogcoffee-220123",
    storageBucket: "blogcoffee-220123.appspot.com",
    messagingSenderId: "435544119561"
  };
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref()

export default firebase;