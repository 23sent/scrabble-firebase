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

var specialSquaresOriginal = specialSquares;

var wordMultip = {"TW": 3, "DW":2};
var letterMultip = {"TL": 3, "DL":2};



class Game {
    constructor(names) {
        let newBag = createBag();

        this.board = {};
        this.bag = newBag;
        this.players = {};
        this.whoseTurn = 0;
        let newPlayers = {};
        for (let i = 0; i < names.length; i++) {
            let player = names[i];
            let newRack = this.getFromBag(7);
            newPlayers[player] = { score: 0, que: i, rack: newRack };
        }
        this.players = newPlayers;
    }

    getFromBag(n) {
        let pieces = [];
        let i = 0;
        while (i < n & this.bag.length > 0) {
            let randomPiece = this.bag[Math.floor(Math.random() * this.bag.length)];
            pieces.push(randomPiece);
            this.bag.splice(this.bag.indexOf(randomPiece), 1);
            i++;
        }
        return pieces;
    };

    setBoard() {
        for (const target in this.board) {
            let char = this.board[target];
            if (!document.getElementById(target).hasChildNodes()) {
                //Replaced jquery with javascript.DOM
                //$("#" + target).append(createPiece(char, false));
                let newP = this.createPiece(char, false);
                document.getElementById(target).insertAdjacentHTML("beforeend", newP);
            }
            else {
                //console.log("Already there is piece in " + target);
            }
        }
    };

    setRack(currentPlayer) {
        let tempRack = this.players[currentPlayer].rack;
        $("#rack").children().remove();
        tempRack.forEach(char => $("#rack").append(this.createPiece(char, true)));
    };

    calculateScore(squares) {
        let score = 0;
        let multiplier = 1;
        let word = "";
        for (let i = 0; i < squares.length; i++) {
            let square = squares[i];
            let squareType = window.specialSquares[square];
            let char = this.board[square];
            let letterMultiplier = letterMultip[squareType] || 1;
            let wordMultiplier = wordMultip[squareType] || 1;
            score = score + originalBag[char][0] * letterMultiplier;
            multiplier = multiplier * wordMultiplier;
            delete specialSquares[square];
            word = word+" "+char;
        }

        return score * multiplier;
    };

    getRowCol(move){
        let row = new Set();
        let col = new Set();
        for(let i = 0; i<move.length; i++){
                let square = move[i];
                row.add(square.substring(0,2));
                col.add(square.substring(2,4));
        }

        return [Array.from(row),Array.from(col)];
    }    

    getHorizontalWord(row, col) {
        let squaresInRow = Object.keys(this.board).filter(square => square.substring(0, 2) == row);
        let allWords = [];
        let currentWords = [];
        for (let checkCol = 1; checkCol < 16; checkCol++) {
            if (squaresInRow.includes(row + checkCol.toString().padStart(2, "0"))) {
                currentWords.push(row + checkCol.toString().padStart(2, "0"));
            }
            else {
                if (currentWords.length > 1) { allWords.push(currentWords); };
                currentWords = [];
            }
        }
        if (currentWords.length > 1) { allWords.push(currentWords); };
        let ret = allWords.filter(element => element.includes(row + col));
        return ret;
    };

    getVerticalWord(row, col) {
        let squaresInCol = Object.keys(this.board).filter(square => square.substring(2, 4) == col);
        let allWords = [];
        let currentWords = [];
        for (let checkRow = 1; checkRow < 16; checkRow++) {
            if (squaresInCol.includes(checkRow.toString().padStart(2, "0") + col)) {
                currentWords.push(checkRow.toString().padStart(2, "0") + col);
            }
            else {
                if (currentWords.length > 1) { allWords.push(currentWords); };
                currentWords = [];
            }
        }
        if (currentWords.length > 1) { allWords.push(currentWords); };
        return allWords.filter(element => element.includes(row + col));
    };

    findWords(move) {
        let RowCol = this.getRowCol(move);
        let row = RowCol[0];
        let col = RowCol[1];
        let words = [];

        row.forEach(function (r) {
            col.forEach(function (c) {
                let w = this.getHorizontalWord(r, c);

                if (!words.some(element => JSON.stringify(element) == JSON.stringify(w))) {
                    words.push(w);
                }

                w = this.getVerticalWord(r, c);
                if (!words.some(element => JSON.stringify(element) == JSON.stringify(w))) {
                    words.push(w);
                }
            },this);
        },this);
        return words;
    };

    putBoard(square){
        this.board[square] = $("#"+square).children().attr("data-char");
    }

    updateScoreBoard(){
        for(const player in this.players){
            document.getElementById(player+"-score").textContent = "Score: "+this.players[player].score.toString().padStart(3,"0");
        }
    }
    isValid(move, currentPlayer){
        if(this.whoseTurn != this.players[currentPlayer].que){
            return false
        }
        let rowCol = this.getRowCol(move);
        if(rowCol[0].length != 1 & rowCol[1].length != 1){
            return false;
        }
        return true;
    }

    makeMove(move, currentPlayer){
        if(this.isValid(move, currentPlayer) == false){
            return false;
        }
    
        move.forEach(element => this.putBoard(element));
        move.forEach(s => disableDraggable(s));
    
        let words = this.findWords(move);
        let score = 0;
        
        words.forEach(function(word){
            if(word.length > 0){
                score = score+ this.calculateScore(word[0]);
            }
        
        },this);

        this.players[currentPlayer].score += score;

        
        let newRack = this.getFromBag(move.length);
        let tempRack = $("#rack").children();
        for(let i = 0; i<tempRack.length; i++){
            newRack.push(tempRack[i].attributes["data-char"]["value"]);
        }
        this.players[currentPlayer].rack = newRack;
    
        this.setRack(currentPlayer);


        this.updateScoreBoard()
        window.currentMove = [];
        this.whoseTurn = (this.whoseTurn+1)%Object.keys(this.players).length
        return true;
    }

    updateGame(player){
        this.updateScoreBoard();
        this.setBoard();
        this.setRack(player);
    }

    createPiece(char, isDraggable){
        var newPiece;
        if(isDraggable){
            newPiece = "<div id=\"dargID\" data-char=\"Char\" class=\"stone btn btn-light\" data-fixed=\"false\">Char</div>";
        }else{
            newPiece = "<div id=\"dargID\" data-char=\"Char\" class=\"stone btn btn-light\">Char</div>";
        }
    
        newPiece = newPiece.replace(new RegExp("Char","g"),char);
        newPiece = newPiece.replace("dargID","stone"+stoneId.toString());
        stoneId = stoneId + 1;
        return newPiece;
    }
    
}


function createBag(){
    let newBag = [];
    for(const char in originalBag){
        let count = originalBag[char][1]
        newBag = newBag.concat(Array(count).fill(char))
    }
    return newBag;
}

//---man DOM--
function disableDraggable(square){
    $("#"+square).children().attr("data-fixed","true");
};

//----Create DOM--------

function createScoreBoard(players){
    $("#scoreboard").children().remove();
    let string = "<div id=\"playerName\"class=\"card bg-light\"><div class=\"card-body\"><h6 class=\"card-title\">playerName</h6><p id=\"playerName-score\" class=\"card-text\">Score: 0</p></div></div>";
    for(const player in players){
        document.getElementById("scoreboard").insertAdjacentHTML("beforeend",string.replace(new RegExp("playerName","g"),player))
    }
}

function createTable(row,col) {
    let string = "";
        for(let r = 1; r<=row; r++){
            string = string+"<tr>";
            for (let c = 1; c <= col; c++) {
                squareType = specialSquaresOriginal[r.toString().padStart(2,"0")+c.toString().padStart(2,"0")] || "";
                string = string+"<td id=\""+r.toString().padStart(2,"0")+c.toString().padStart(2,"0")+"\"  data-type=\""+squareType+"\"class=\"square "+squareType+"\"></td>";
            }
            string = string+"</tr>";
        }
    return string;
}