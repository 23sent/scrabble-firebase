var originalBag = {A: [1,12],
    B: [3,2],
    C: [4,2],
    Ç: [4,2],
    D: [3,2],
    E: [1,8],
    F: [7,1],
    G: [5,1],
    Ğ: [8,1],
    H: [5,1],
    I: [2,4],
    İ: [1,7],
    J: [10,1],
    K: [1,7],
    L: [1,7],
    M: [2,4],
    N: [1,5],
    O: [2,3],
    Ö: [7,1],
    P: [5,1],
    R: [1,6],
    S: [2,3],
    Ş: [4,2],
    T: [1,5],
    U: [2,3],
    Ü: [3,2],
    V: [7,1],
    Y: [3,2],
    Z: [4,2],
};
var specialSquares = {
    "0101":"TW",
    "0108":"TW",
    "0115":"TW",
    "1501":"TW",
    "1508":"TW",
    "1515":"TW",
    "0801":"TW",
    "0815":"TW",
    "0202":"DW",
    "0303":"DW",
    "0404":"DW",
    "0505":"DW",
    "1111":"DW",
    "1212":"DW",
    "1313":"DW",
    "1414":"DW",
    "1402":"DW",
    "1303":"DW",
    "1204":"DW",
    "1105":"DW",
    "0214":"DW",
    "0313":"DW",
    "0412":"DW",
    "0511":"DW",
    "0602":"TL",
    "0606":"TL",
    "0610":"TL",
    "0614":"TL",
    "1002":"TL",
    "1006":"TL",
    "1010":"TL",
    "1014":"TL",
    "0206":"TL",
    "0210":"TL",
    "1406":"TL",
    "1410":"TL",
    "1504":"DL",
    "1512":"DL",
    "1307":"DL",
    "1309":"DL",
    "1201":"DL",
    "1208":"DL",
    "1215":"DL",
    "0903":"DL",
    "0907":"DL",
    "0909":"DL",
    "0913":"DL",
    "0804":"DL",
    "0812":"DL",
    "0703":"DL",
    "0707":"DL",
    "0709":"DL",
    "0713":"DL",
    "0401":"DL",
    "0408":"DL",
    "0415":"DL",
    "0307":"DL",
    "0309":"DL",
    "0104":"DL",
    "0112":"DL",
    "0808":"DW",
};

var wordMultip = {"TW": 3, "DW":2};
var letterMultip = {"TL": 3, "DL":2};

var currentMove = [];
var stoneId = 0;

//-----Objects-----
var Game = {
    whoseTurn: 0,
    board : {},
    players : {},
    bag : [],
    deneme: function(){console.log(bag)},
};

//--Create Game--
function createGame(players, c){
    window.currentGame = Object.assign({}, Game);
    window.currentGame.bag = createBag();
    window["currentPlayer"] = c;
    
    for(let i = 0; i<players.length;i++){
        let player = players[i];
        let newRack = getFromBag(7); 
        window.currentGame.players[player] = {score:0, que: i, rack:newRack};
    }
    
    createScoreBoard();
}

function setGameFromData(game){
    window.currentGame = game;
    window.currentGame["board"] = currentGame["board"] || {};
    setGame();
}

function setGame(){
    changeScoreBoard();
    setBoard(window.currentGame.board);
    setRack(window.currentGame.players[window.currentPlayer].rack);
}

function createBag(){
    let newBag = [];
    for(const char in originalBag){
        let count = originalBag[char][1]
        newBag = newBag.concat(Array(count).fill(char))
    }
    return newBag;
}

//---Func---
function makeMove(move){
    if(isValid(move) == false){
        return false;
    }

    move.forEach(element => putBoard(element));
    move.forEach(s => disableDraggable(s));

    let words = findWords(move);
    let score = 0;
    words.forEach(function(word){
        //console.log(word[0],calculateScore(word[0] || []));
        score = score+ calculateScore(word[0] || []);
    });

    window.currentGame.players[window.currentPlayer].score += score;

    let newRack = getFromBag(window.currentMove.length);
    let tempRack = $("#rack").children();
    for(let i = 0; i<tempRack.length; i++){
        newRack.push(tempRack[i].attributes["data-char"]["value"]);
    }
    window.currentGame.players[window.currentPlayer].rack = newRack;

    changeScoreBoard()
    setRack(window.currentGame.players[window.currentPlayer].rack);
    window.currentMove = [];
    return true;
}

function putBoard(square){
    window.currentGame.board[square] = $("#"+square).children().attr("data-char");
}

function calculateScore(squares){
    let score = 0;
    let multiplier = 1;

    for(let i = 0; i < squares.length; i++){
        let square = squares[i];
        let squareType = $("#"+square).attr("data-type");
        let char = $("#"+square).children().attr("data-char");
        let letterMultiplier = letterMultip[squareType] || 1;
        let wordMultiplier = wordMultip[squareType] || 1;

        score = score + originalBag[char][0]*letterMultiplier;
        multiplier = multiplier*wordMultiplier;
    }
    return score*multiplier;
}

function getFromBag(n){
    let pieces = [];
    let i = 0; 
    while(i<n & currentGame.bag.length > 0){
        randomPiece = currentGame.bag[Math.floor(Math.random()*currentGame.bag.length)];
        pieces.push(randomPiece);
        currentGame.bag.splice(randomPiece, 1);
        i++;
    }
    return pieces; 
}

//---WordCheck Functions--
function isValid(move){
    if(window.currentGame.whoseTurn != window.currentGame.players[currentPlayer].que){
        return false
    }
    let rowCol = getRowCol(move);
    if(rowCol[0].length != 1 & rowCol[1].length != 1){
        return false;
    }
    return true;
}

function getRowCol(move){
    let row = new Set();
    let col = new Set();
    for(let i = 0; i<move.length; i++){
            square = move[i];
            row.add(square.substring(0,2));
            col.add(square.substring(2,4));
    }

    return [Array.from(row),Array.from(col)];
}    

function findWords(move){
    let RowCol = getRowCol(move);
    let row = RowCol[0];
    let col= RowCol[1];
    let words = [];

    row.forEach(function(r){
        col.forEach(function(c){
            let w = getHorizontalWord(r,c);
            if(!words.some(element => JSON.stringify(element) == JSON.stringify(w))){
                words.push(w);
            }

            w = getVerticalWord(r,c);
            if(!words.some(element => JSON.stringify(element) == JSON.stringify(w))){
                words.push(w);
            }
        });
    });

    return words;
}

function getHorizontalWord(row,col){
    let squaresInRow = Object.keys(window.currentGame.board).filter(square => square.substring(0,2) == row);
    //squaresInRow = squaresInRow.concat(window.currentMove.filter(square => square.substring(0,2) == row));
    let allWords = [];
    let currentWords = [];
    for(let checkCol = 1; checkCol <= 15; checkCol++){
        if(squaresInRow.includes(row+checkCol.toString().padStart(2,"0"))){
            currentWords.push(row+checkCol.toString().padStart(2,"0"));
        }else{
            if(currentWords.length > 1){allWords.push(currentWords)};
            currentWords = [];
        }
    }
    return allWords.filter(element => element.includes(row+col))
}
function getVerticalWord(row,col){
    let squaresInCol = Object.keys(window.currentGame.board).filter(square => square.substring(2,4) == col);
    //squaresInCol = squaresInCol.concat(window.currentMove.filter(square => square.substring(2,4) == col));
    let allWords = [];
    let currentWords = [];
    for(let checkRow = 1; checkRow <= 15; checkRow++){
        if(squaresInCol.includes(checkRow.toString().padStart(2,"0")+col)){
            currentWords.push(checkRow.toString().padStart(2,"0")+col);
        }else{
            if(currentWords.length > 1){allWords.push(currentWords)};
            currentWords = [];
        }
    }
    return allWords.filter(element => element.includes(row+col))
}

//----Set DOM------,
function changeScoreBoard(){
    for(const player in currentGame.players){
        $("#"+player+"-score").text("Score: "+currentGame.players[player].score.toString().padStart(3,"0"));

    }
}

function setBoard(pboard){
    for (const target in pboard) {
        let char = pboard[target];
        if(!document.getElementById(target).hasChildNodes()){
            $("#"+target).append(createPiece(char, false));
        }else{
            console.log("Already there is piece in "+target);
        }
    }
}

function disableDraggable(square){
    $("#"+square).children().attr("draggable","false");
};

function setRack(alph){
    $("#rack").children().remove()
    for(let i = 0; i < alph.length; i++){
        char = alph[i];
        $("#rack").append(createPiece(char, true));
    }
}

//----Create DOM--------
function createPiece(char, isDraggable){
    if(isDraggable){
        newPiece = "<div id=\"dargID\" data-char=\"Char\" class=\"stone btn btn-light\" draggable=\"true\" ondragstart=\"drag(event)\">Char</div>";
    }else{
        newPiece = "<div id=\"dargID\" data-char=\"Char\" class=\"stone btn btn-light\">Char</div>";
    }

    newPiece = newPiece.replaceAll("Char",char);
    newPiece = newPiece.replace("dargID","stone"+stoneId.toString());
    stoneId = stoneId + 1;
    return newPiece;
}

function createTable(row,col) {
    let string = "";
        for(let r = 1; r<=row; r++){
            string = string+"<tr>";
            for (let c = 1; c <= col; c++) {
                squareType = specialSquares[r.toString().padStart(2,"0")+c.toString().padStart(2,"0")] || "";
                string = string+"<td id=\""+r.toString().padStart(2,"0")+c.toString().padStart(2,"0")+"\"  data-type=\""+squareType+"\"class=\"square "+squareType+"\" ondrop=\"drop(event)\" ondragover=\"allowDrop(event)\"></td>";
            }
            string = string+"</tr>";
        }
    return string;
}

function createScoreBoard(){
    let string = "<div id=\"playerName\"class=\"card bg-light\"><div class=\"card-body\"><h6 class=\"card-title\">playerName</h6><p id=\"playerName-score\" class=\"card-text\">Score: 0</p></div></div>";
    for(const player in currentGame.players){
        $("#scoreboard").append(string.replaceAll("playerName",player));

    }
}
//-------Drag and Drop-----

function allowDrop(ev) {
    if(ev.target.hasChildNodes()){
        return false;
    }
    ev.preventDefault();
}

function allowDropTabla(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let parent = document.getElementById(data).parentElement.id

    ev.target.appendChild(document.getElementById(data));
    if(currentMove.indexOf(parent) != -1){currentMove.splice(currentMove.indexOf(parent),1)}
    if(ev.target.id != "rack"){currentMove.push(ev.target.id);}
    

}
