var currentMove = [];
var stoneId = 0;
var selectedPiece = false;   

function unselectStone(item){
    item.classList.remove("btn-warning");  
    item.classList.add("btn-light");
}

function selectStone(element){
    document.querySelectorAll(".stone").forEach(item => { unselectStone(item) } );
    element.classList.remove("btn-light");
    element.classList.add("btn-warning");
    selectedPiece = element;
}

function selectStoneTarget(element){
    if(selectedPiece != false && (element.childNodes.length == 0 || element.id == "rack")){
        let parent = document.getElementById(selectedPiece.id).parentElement

        element.appendChild(selectedPiece);
        unselectStone(selectedPiece);
        selectedPiece = false;
        
        if(currentMove.indexOf(parent.id) != -1) {
            currentMove.splice(currentMove.indexOf(parent.id),1)
        }
        console.log(element.tagName);
        if(element.tagName == "TD"){
            currentMove.push(element.id);
        }
    }
}


function main(){
    document.querySelector("table").innerHTML = createTable(15,15);

    document.getElementById("frame").addEventListener("click", element => {
        if(element.target.classList.contains("stone") &&
           element.target.getAttribute("data-fixed") == "false") {
            selectStone(element.target)
        } else if (element.target.parentNode.classList.contains("stone") &&
                   element.target.parentNode.getAttribute("data-fixed") == "false"){
            selectStone(element.target.parentNode)
        }
    })
    
    document.querySelectorAll("td").forEach(item => item.addEventListener("click", event => selectStoneTarget(event.target)))
    document.getElementById("rack").addEventListener("click", event => selectStoneTarget(event.target))
    
    var currentGame = new Game(["Oyuncu 1","Oyuncu 2"]);

    currentPlayer = ["Oyuncu 1","Oyuncu 2"][currentGame.whoseTurn];
    createScoreBoard(currentGame.players);
    currentGame.updateGame(currentPlayer);

    document.querySelector("#makeMove").onclick = function(){
        console.log(currentPlayer);
        if(currentGame.makeMove(currentMove,currentPlayer)){
            currentPlayer = ["Oyuncu 1","Oyuncu 2"][currentGame.whoseTurn];
            currentGame.updateGame(currentPlayer);
        }   
    };
}

window.onload = main;