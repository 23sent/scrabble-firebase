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
   
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var currentGame = new Game(["buadalinmadi","deneme"]);
            createScoreBoard(currentGame.players);

            var currentPlayer = user.email.split("@")[0];
            var oyuncular = firebase.database().ref("Oyuncular");
            var data = firebase.database().ref("games");

            let players;

            oyuncular.once("value", function(snapshot){
                console.log(snapshot.val().split(" "));
                players = snapshot.val().split(" ");
            });


            $("#logOut").click(function(){
                firebase.auth().signOut().then(function(){
                    window.location = "login.html"
                });
            });

            $("#makeMove").click(function(){
                if(currentGame.makeMove(currentMove,currentPlayer)){
                    firebase.database().ref('games/').set(currentGame);
                }
            });
  
            $("#reset").click(function(){
                currentGame = new Game(["buadalinmadi","deneme"]);
                firebase.database().ref('games/').set(currentGame);
            });
  
            data.on('value', function(snapshot){
                currentGame.bag = snapshot.val().bag;
                currentGame.players = snapshot.val().players;
                currentGame.whoseTurn = snapshot.val().whoseTurn;
                currentGame.board = snapshot.val()["board"] || {};
                currentGame.updateGame(currentPlayer);
                console.log(snapshot.val());
                console.log(currentGame);

            });
  
        } else {
          alert("Giriş yapılmadı.")
        }
      });
   
    
    $("td").click(function(){
        console.log(this.id);
    });

    /*
    $("#makeMove").click(function(){
        currentGame.makeMove(currentMove, currentPlayer);
    });*/
    

});