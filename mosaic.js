class GuessMosaics extends HTMLElement{
    constructor(){
        super()
        this.levels = []
        this.pictures = []
        this.wrapper = this.createElem( "div" )
        this.controls = this.createElem( "div", this.wrapper ) 
        this.guessWrapper = this.createElem( "div", this.controls ) 
        this.guessInput = this.createElem( "input", this.guessWrapper )
        this.guessInput.placeholder = "Enter the city name"
        this.guessConfirm = this.createElem( "button", this.guessWrapper )
        this.guessConfirm.innerText = "OK"
        this.guessConfirm.onclick = this.checkWin.bind(this)
        this.counter = 0
        this.difficultyLevels 
        this.difficultySelection
        this._img = new Image()
        this.cardBack = new Image()
        this.currentPict 
        this.currentPictUrl 
        this.loadData ( )
        this.difficulty
        this._pieces;
        this._puzzleWidth
        this._puzzleHeight
        this._pieceWidth
        this._pieceHeight
        this._currentPiece        
        this._canvas = this.createElem('canvas', this.wrapper)
        this._stage = this._canvas.getContext('2d')
        this._mouse 
        this._currentPiece   
        this.changePic = this.controls.insertBefore(this.createElem("button", this.controls), this.guessWrapper)
        this.changePic.innerText = "Change picture"
        this.changePic.onclick = this.choosePicture.bind(this, true)
        
    }
    async loadData () {
        await Promise.all ( [
            this.getData ( "levels" )
                .then ( x => {
                    this.levels = x 
                    this.difficultyLevels = this.levels.map(
                        level => level.name            
                    )
                    this.difficultySelection = this.controls.insertBefore(this.buildTextSelect (this.difficultyLevels), this.changePic)
                    this.difficultySelection.addEventListener("change", this.chooseLevel.bind(this))
                }) , 
            this.getData ( "pictures" )
                .then ( x => {
                    this.pictures = x 
                    this.choosePicture()               
                }),
            this.getData("cardBack")
                .then (res => {
                    this.cardBack.src = res[0].url
                console.log(res[0].url)
                })
        ] )
        
    }
    
    getData(ref){
        return fetch("http://localhost:3000/" + ref)
            .then(response => response.json())
    }
    chooseLevel(event){
        this.difficulty = this.levels.filter(
            level => level.name === event.target.value
        )[0].tilesAmount
        console.log(this.difficulty) 
        // this.resizeImage()
        this.onImage()
        // this._pieceWidth = Math.floor(this.currentPict.width / PUZZLE_DIFFICULTY)
        // this._pieceHeight = Math.floor(this.currentPict.height / PUZZLE_DIFFICULTY)
    }
    choosePicture(){
        this.currentPict = this.pictures[Math.floor(Math.random() * this.pictures.length)]
        this._img.src = this.currentPict.url
          
        console.log(  this._img.src) 
        if(arguments[0] && this.difficulty > 0 ){
            this.difficulty = null
            this.difficultySelection.value = this.levels[0].name
            this._stage.clearRect(0,0,this._canvas.width,this._canvas.height)
            this._canvas.style.display = "none"
        }
        
    } 
    onImage(e){
        let currentWidth = window.innerWidth * 0.8
        let currentHeight = 0.75 * currentWidth
        
        this._pieceWidth = Math.floor((this._img.width > currentWidth ? currentWidth : this._img.width) / this.difficulty)
        this._pieceHeight = Math.floor((this._img.height > currentHeight ? currentHeight : this._img.height) / this.difficulty)
        this._puzzleWidth = this._pieceWidth * this.difficulty
        this._puzzleHeight = this._pieceHeight * this.difficulty

        // this._pieceWidth = Math.floor(this._img.width / this.difficulty)
        // this._pieceHeight = Math.floor(this._img.height / this.difficulty)
        // this._puzzleWidth = this._pieceWidth * this.difficulty
        // this._puzzleHeight = this._pieceHeight * this.difficulty       
        
        console.log( `Onimage puzzle width ${this._puzzleWidth}`)
        this.setCanvas();
        this.initPuzzle();
    }
    setCanvas(){
        console.log("hello")
        // this._canvas = this.createElem('canvas', this.wrapper)
        // this._stage = this._canvas.getContext('2d');
        this._canvas.width = this._puzzleWidth;
        this._canvas.height = this._puzzleHeight;
        this._canvas.style.border = "1px solid black";
        this._canvas.style.display = "block"
        console.log(this._canvas.width)
    }
    initPuzzle(){
        this._pieces = [];
        this._mouse = {x:0,y:0};
        this._currentPiece = null;
        // _currentDropPiece = null;
        var startXpos = Math.abs(this._img.width - this._puzzleWidth) / 2
        var startYpos = Math.abs(this._img.height - this._puzzleHeight) / 2
        
        this._stage.drawImage(this._img, startXpos, startYpos, this._puzzleWidth, this._puzzleHeight, 0, 0, this._puzzleWidth, this._puzzleHeight)
        this.buildPieces()
    }
    buildPieces(){        
        let i;
        let piece;        
        let xPos = 0;
        let yPos = 0;
        for(i = 0;i < this.difficulty * this.difficulty;i++){
            piece = {};
            piece.sx = xPos + Math.abs(this._img.width - this._puzzleWidth) / 2;
            piece.sy = yPos + Math.abs(this._img.height - this._puzzleHeight) / 2;
            this._pieces.push(piece);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        console.dir(this._pieces)
        document.onmousedown = this.shufflePuzzle();
    }
    shufflePuzzle(){        
        // _pieces = shuffleArray(_pieces);
        // _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
        let i;
        let piece;
        let xPos = 0
        let yPos = 0
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            this._stage.drawImage(this.cardBack, piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight, xPos, yPos, this._pieceWidth, this._pieceHeight);
            this._stage.strokeRect(xPos, yPos, this._pieceWidth,this._pieceHeight);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        document.onmousedown = this.onPuzzleClick.bind(this);
    } 
    onPuzzleClick(e){
        console.log("click")
        if(e.layerX || e.layerX == 0){
            this._mouse.x = e.layerX - this._canvas.offsetLeft;
            this. _mouse.y = e.layerY - this._canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            this._mouse.x = e.offsetX - this._canvas.offsetLeft;
            this._mouse.y = e.offsetY - this._canvas.offsetTop;
        }
        this._currentPiece = this.checkPieceClicked();
        if(this._currentPiece != null){
            this._stage.clearRect(this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);
            this._stage.save();
            this._stage.globalAlpha = .9;
            console.log(`sx ${this._currentPiece.sx} sy ${this._currentPiece.sy} xPos ${this._currentPiece.yPos} yPos ${this._currentPiece.yPos}`)
            this._stage.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight, this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);
            this._stage.restore();
            // document.onmousemove = updatePuzzle;
            // document.onmouseup = pieceDropped;
        }
    }
    checkPieceClicked(){
        console.log("check piece clicked")
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            if(this._mouse.x > piece.xPos && this._mouse.x < (piece.xPos + this._pieceWidth) && this._mouse.y > piece.yPos && this._mouse.y < (piece.yPos + this._pieceHeight)){
                this.counter += 1
                return piece;
            }            
        }
        return null;
    }

    checkWin(){
        if(this.guessInput.value.toUpperCase() === this.currentPict.name.toUpperCase()){
            var startXpos = Math.abs(this._img.width - this._puzzleWidth) / 2
            var startYpos = Math.abs(this._img.height - this._puzzleHeight) / 2        
            this._stage.drawImage(this._img, startXpos, startYpos, this._puzzleWidth, this._puzzleHeight, 0, 0, this._puzzleWidth, this._puzzleHeight)
            
        } else {
            alert('Попробуй еще раз')
			this.guessInput.value = null
			this.counter++
        }
        
    }





    buildTextSelect (options, container){
        var sel = document.createElement('select')
        var _container = !container ? document.body : container
        _container.appendChild(sel)
        for (var item of options){
            var opt = document.createElement('option')
            sel.appendChild(opt)
            opt.innerText = item
        }
        return sel
    }
    createElem ( tagName, container ) {
        return  ( !container ? document.body : container )
                .appendChild (
                document.createElement ( tagName )
                )
    }
    
}



customElements.define("guess-mosaics", GuessMosaics)