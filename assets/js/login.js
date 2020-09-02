$(document).ready(function(){
      // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAk2BZovB00qe9MqKuD4C4j9wkFua8Oz00",
        authDomain: "scrabble-js.firebaseapp.com",
        databaseURL: "https://scrabble-js.firebaseio.com",
        projectId: "scrabble-js",
        storageBucket: "scrabble-js.appspot.com",
        messagingSenderId: "674947027180",
        appId: "1:674947027180:web:186307da54eefa9b23d5c9"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    

    $("#login").click(function(){
        var email = $("#email").val();
        var password = $("#password").val();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(){
                window.location.href = "index.html";
            }).catch(function(error){
                alert(error.message);
            })
    });

});