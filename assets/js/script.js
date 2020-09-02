$(document).ready(function(){
    var currentPlayer = "Oyuncu1";
    var currentGame = new Game(["Oyuncu1", "Oyuncu2"]);
    currentGame.setBoard();
    currentGame.setRack(currentPlayer);
    console.log(currentGame.board)
    console.log(currentGame.findWords("0808"));
    
    $("td").click(function(){
        console.log(this.id);
    });

    /*
    $("#makeMove").click(function(){
        makeMove(window.currentMove);
    });
    createGame(["Oyuncu1","Oyuncu2"]);
    window.currentGame.board = {"0809":"A","0807":"B","0810":"Z","0711":"A"};
    setGame();*/

});