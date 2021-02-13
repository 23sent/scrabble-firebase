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
        document.getElementById("rack").innerHTML = "";
        tempRack.forEach(char => document.getElementById("rack").insertAdjacentHTML("beforeend", this.createPiece(char, true)));
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
        this.board[square] = document.getElementById(square).childNodes[0].getAttribute("data-char");
    }

    updateScoreBoard(){
        createScoreBoard(this.players);
        for(const player in this.players){
            //document.getElementById(player+"-score").classList.add("");
            document.getElementById(player+"-score").textContent = "Score: "+this.players[player].score.toString().padStart(3,"0");
            if(this.whoseTurn == this.players[player].que){
                document.getElementById(player).style.backgroundColor = "rgb(0, 0, 0)";
                document.getElementById(player).style.color = "var(--light)";

            }
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
        if(this.isGameEnded()){
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
        let tempRack = document.getElementById("rack").childNodes;
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
        if(this.isGameEnded()){
            this.whoWin();
        };
        this.updateScoreBoard();
        this.setBoard();
        this.setRack(player);
    }

    isGameEnded(){
        for(const name in this.players){
            if(this.players[name].rack == 0){
                return true
            }
        }
        return false
    }

    whoWin(){
        for(const name in this.players){
            let negativeScore = 0;
            this.players[name].rack.forEach(element => negativeScore += originalBag[element][0])
            this.players[name].score = this.players[name].score - negativeScore;
        }
        alert("Oyun Bitti.")
    }

    createPiece(char, isDraggable){
        var newPiece;
        if(isDraggable){
            //newPiece = "<div id=\"dargID\" data-char=\"Char\" class=\"btn btn-light stone\" data-fixed=\"false\">Char</div>";
            newPiece = "<svg id=\"dargID\" data-char=\"Char\" class=\"btn btn-light stone\" data-fixed=\"false\" height=\"50\" width=\"50\"><text x=\"5%\" y=\"43%\" fill=\"black\">Char</text><text x=\"70%\" y=\"95%\" fill=\"black\">Value</text></svg>"
        }else{
            newPiece = "<div id=\"dargID\" data-char=\"Char\" class=\"btn btn-light stone\">Char</div>";
            newPiece = "<svg id=\"dargID\" data-char=\"Char\" class=\"btn btn-light stone\" data-fixed=\"true\" height=\"50\" width=\"50\"><text x=\"5%\" y=\"43%\" fill=\"black\">Char</text><text x=\"70%\" y=\"95%\" fill=\"black\">Value</text></svg>";
        }
    
        newPiece = newPiece.replace(new RegExp("Char","g"),char);
        newPiece = newPiece.replace("dargID","stone"+stoneId.toString());
        newPiece = newPiece.replace("Value", originalBag[char][0]);
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
    document.getElementById(square).childNodes[0].setAttribute("data-fixed","true");
};

//----Create DOM--------

function createScoreBoard(players){
    document.getElementById("scoreboard").innerHTML = "";
    let string = "<div id=\"playerName\"class=\"sboard\"><div class=\"sboard-body\"><h6 class=\"sboard-title\">playerName</h6><p id=\"playerName-score\" class=\"sboard-text\">Score: 0</p></div></div>";
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