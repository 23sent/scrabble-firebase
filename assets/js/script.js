var currentMove = [];
var stoneId = 0;
//document.documentElement.style.setProperty("--square-size",  ((document.getElementById("frame").clientWidth/15)+"px"));

$(document).ready(function(){
    var selectedPiece = false;   

    $(document).on("click", ".stone[data-fixed=false]",function(){
        $(".stone").removeClass("btn-warning");
        $(".stone").addClass("btn-light");
        $(this).removeClass("btn-light");
        $(this).addClass("btn-warning");
        selectedPiece = this;
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
            var currentPlayer = user.email.split("@")[0];
            var currentGame = new Game([]);
            var data = firebase.database().ref("games");
            var oyuncular = firebase.database().ref("Oyuncular");

            let players;

            oyuncular.once("value", function(snapshot){
                console.log(snapshot.val().split(" "));
                players = snapshot.val().split(" ");
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
                if (confirm("Var olan oyun kaydedilmeyecek!")) {
                    currentGame = new Game(players);
                    firebase.database().ref('games/').set(currentGame);
                    window.location.href = "index.html";
                  }
            });

            //Chat
            var chat = new FirebaseChat("chatBox", "chatBoxButton", firebase.database().ref("messages/"), currentPlayer);
            chat.chatBox.getElementsByClassName("chat-close")[0].onclick = function(){
                document.getElementById("chatBox").style.display = "none"
            }; 
            chat.chatButton.onclick = function(){
                document.getElementById("chatBox").style.display = "block";
                document.getElementById("chatBoxButton").classList.remove("btn-danger");
                document.getElementById("chatBoxButton").classList.add("btn-secondary");
            };

            chat.chatBox.getElementsByTagName("button")[0].onclick = function(){chat.sendMessages()};
  
        } else {
            document.getElementById("chatBoxButton").style.display = "none";
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
                });
        }
      });
    
});