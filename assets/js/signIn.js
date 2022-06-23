const userDb = firebase.database().ref('users');
const submitName = document.querySelector('#submitName');
const userName = document.querySelector('#name');
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        var userRef = firebase.auth().ref().child(uid);
        userRef.child('displayName').set(userName.textContent)
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  

function signIn(event) {

    firebase.auth().signInAnonymously()
    .then(() => {
      // Signed in..
      const user = {};


    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
    event.preventDefault();
}


submitName.addEventListener('click', signIn)