var currentMove = [];
var stoneId = 0;
$(document).ready(function(){
    var selectedPiece = false;

    $(document).on("click", ".stone[data-fixed=false]",function(){
        $(".stone").removeClass("btn-warning");
        $(".stone").addClass("btn-light");
        $(this).removeClass("btn-light");
        $(this).addClass("btn-warning");
        selectedPiece = this;
        console.log($(this).attr("id"));
    });

    $("td").click(function(){
        if(selectedPiece != false & $(this).children().length == 0){
            let parent = document.getElementById(selectedPiece.id).parentElement.id
            $(selectedPiece).appendTo(this);
            selectedPiece = false;
            $(".stone").removeClass("btn-warning");
            $(".stone").addClass("btn-light");

            
            if(currentMove.indexOf(parent) != -1){currentMove.splice(currentMove.indexOf(parent),1)}
            currentMove.push(this.id);
        }
    });

    $("#rack").click(function(){
        if(selectedPiece != false){
            let parent = document.getElementById(selectedPiece.id).parentElement.id
            $(selectedPiece).appendTo(this);
            selectedPiece = false;
            $(".stone").removeClass("btn-warning");
            $(".stone").addClass("btn-light");

            if(currentMove.indexOf(parent) != -1){currentMove.splice(currentMove.indexOf(parent),1)}
        }
    })
        


    
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
   
    firebase.auth().onAuthStateChanged(function(user){
        if (user){
            alert(user.email);
            var currentPlayer = user.email.split("@")[0];
            var currentGame = new Game(["buadalinmadi","deneme"]);
            createScoreBoard(currentGame.players);
            var data = firebase.database().ref("games");
            
            var oyuncular = firebase.database().ref("Oyuncular");

            let players;

            oyuncular.once("value", function(snapshot){
                console.log(snapshot.val().split(" "));
                players = snapshot.val().split(" ");
            });


            document.getElementById("logOut").addEventListener("click",function(){
                firebase.auth().signOut();
                alert("Çıkış yapıldı.");
            });

            $("#makeMove").click(function(){
                if(currentGame.makeMove(currentMove,currentPlayer)){
                    alert("Gönderdi.");
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
            var currentGame = new Game(["Oyuncu 1","Oyuncu 2"]);

            currentPlayer = ["Oyuncu 1","Oyuncu 2"][currentGame.whoseTurn];
                createScoreBoard(currentGame.players);
                currentGame.updateGame(currentPlayer);

                $("#makeMove").click(function(){
                    console.log(currentPlayer);
                    currentGame.makeMove(currentMove,currentPlayer);
                    currentPlayer = ["Oyuncu 1","Oyuncu 2"][currentGame.whoseTurn];
                    currentGame.updateGame(currentPlayer);
                    alert(currentPlayer);
                });
        }
      });
    
});