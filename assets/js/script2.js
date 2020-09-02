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
          window.currentPlayer = user.email.split("@")[0];
          var currentGame;
          var oyuncular = firebase.database().ref("Oyuncular");

          createGame(["buadalinmadi","Oyuncu2"], user.email.split("@")[0]);
          setGame();
          
         

          console.log("Giriş yapıldı.");
          $("#logOut").click(function(){
              firebase.auth().signOut().then(function(){
                  window.location = "login.html"
              });
          });

          var data = firebase.database().ref("games");

          $("#makeMove").click(function(){
              //firebase.database().ref().child("games").push("deneme")
              if(makeMove(window.currentMove)){
                  firebase.database().ref('games/').set(currentGame);
              }
          });

          $("#reset").click(function(){
              createGame(["Oyuncu1","Oyuncu2"]);
              firebase.database().ref('games/').set(currentGame);
          });

          
          data.on('value', function(snapshot){
              setGameFromData(snapshot.val());
          });

      } else {
        alert("Giriş yapılmadı.")
      }
    });
    
  
  /*$("td").click(function(){
      console.log(this.id);
  });
  $("#makeMove").click(function(){
      makeMove(window.currentMove);
  });
  createGame(["Oyuncu1","Oyuncu2"]);
  window.currentGame.board = {"0809":"A","0807":"B","0810":"Z","0711":"A"};
  setGame();*/

});