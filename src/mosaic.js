class GuessMosaics extends HTMLElement{
    constructor(){
        super()
        this.levels = []
        this.pictures = []
        this.wrapper = this.createElem( "div" )
        this.controls = this.createElem( "div", this.wrapper )
        this.controls.id = "controls"
        this.guessWrapper = this.createElem( "div", this.wrapper )
        this.guessWrapper.id = "guessWrapper"
        this.guessInput = this.createElem( "input", this.guessWrapper )
        this.guessInput.placeholder = "Enter the city name"
        this.guessConfirm = this.createElem( "button", this.guessWrapper )
        this.guessConfirm.id = "ok"
        this.guessConfirm.innerText = "OK"
        this.guessConfirm.onclick = this.checkWin.bind(this)

        this.canvasWrap = this.createElem( "div", this.wrapper ) 
        this.canvasWrap.id = "canvasWrap"

        this.counter = 0
        this.setMaxScore
        this.coins = 0
        this.difficultyLevels 
        this.difficultySelection
        this._img 
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
        this._canvas = this.createElem('canvas', this.canvasWrap)
        this._stage = this._canvas.getContext('2d')
        this._mouse 
        this._currentPiece   
        this.changePic = this.createElem("button", this.controls)
        this.changePic.innerText = "Change picture"
        this.changePic.onclick = this.choosePicture.bind(this, true)

        this.openPiece = this.createElem("button", this.controls)
        this.openPiece.innerHTML = "Open random piece for 12 coins"
        this.openPiece.id = "open_piece"
        this.openPiece.onclick = this.openRandomPiece.bind(this)


        let style = document.createElement ( 'style' )
        style.textContent = `
        div{
            text-align: center;
        }
        #controls{
            text-align: left;
            display: flex;
        }
        #guessWrapper{
            display: none;            
            text-align: center;
            
        }
        #canvasWrap{
            position: absolute;
            top: 57%; 
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);           
        }
        #canvas{
            box-sizing: border-box;            
        }  

               
        button{
            display: inline-block;
            width: 170px;
            height: 44px;
            margin: 10px;
            background-color: #f26d25;
            font-family: 'Montserrat';
            font-size: 12px;
            color: #ffffff;
            text-transform: uppercase;
            border: 1px solid #555555;
            border-radius: 5px;
            text-align: center;
            line-height: 20px;
            letter-spacing: 0.6px;
            cursor: pointer;
        }
        button:active, button:focus {
            outline: none !important;
        }
        button::-moz-focus-inner {
            border: 0 !important;
        }
        button:hover{
            background-color: #dc251f;
            color: #ffffff;
        }
        #open_piece{
            display: none;
            font-size: 12px;
            text-transform: uppercase;
            // margin: 10px 80px;
        }

        select{
            margin: 10px;
            width: 190px;
            font-family: 'Montserrat' !important;
            font-size: 12px;
            text-align: center;
            color: #555555;
            height: 44px;
            padding: 10px;
            text-transform: uppercase;
            border: 1px solid #555555;
            border-radius: 5px;
            outline: 0;
        }
        input  {
            /* width: 80%; */
            height: 24px;
            margin: 10px;
            padding: 10px;
            border: 1px solid #555555;
            border-radius: 5px;
            outline: 0;
        }
        
        ::-webkit-input-placeholder {
            font-family: 'Montserrat' !important;
            font-size: 12px;
            color: #555555;
            text-transform: uppercase;
        }    
        :-moz-placeholder { /* Firefox 18- */
            font-family: 'Montserrat';
            font-size: 12px;
            color: #555555;
            text-transform: uppercase;
        }    
        ::-moz-placeholder {  /* Firefox 19+ */
            font-family: 'Montserrat';
            font-size: 12px;
            color: #555555;
            text-transform: uppercase;  
        }    
            :-ms-input-placeholder {
            font-family: 'Montserrat';
            font-size: 12px;
            color: #555555;
            text-transform: uppercase; 
        }
        input:focus{
            border: 1px solid #c0301c;
        }
        :focus::-webkit-input-placeholder {color: transparent}
        :focus::-moz-placeholder          {color: transparent}
        :focus:-moz-placeholder           {color: transparent}
        :focus:-ms-input-placeholder      {color: transparent}`
        this.shadow = this.attachShadow ( { mode: 'open' } )
        this.shadow.appendChild ( style )
        this.shadow.appendChild ( this.wrapper )
        
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
                    // this.choosePicture()               
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
        this.guessWrapper.style.display = "block"
        this.openPiece.style.display = "inline-block"
        !document.querySelector("#initial_img") ? null : initialImg.parentNode.removeChild(initialImg) 
        
        this.choosePicture()
        // this.onImage()        
    }

    
    choosePicture(){
        this._img = new Image()
        this.currentPict = this.pictures[Math.floor(Math.random() * this.pictures.length)]
        this._img.onload = this.onImage.bind(this)
        this._img.src = this.currentPict.url
      
        console.log(  `choosePic image src ${this._img.src}`) 
        console.log( `choosePic image width ${this._img.width}`) 
        if(arguments[0] && this.difficulty > 0 ){            
            this._stage.clearRect(0,0,this._canvas.width,this._canvas.height)
            this._canvas.style.display = "none"
            this.resetControls()
        }
        
    } 
    onImage(e){
        let currentWidth = window.innerWidth * 0.7
        let currentHeight = 0.5 * currentWidth
        
        this._pieceWidth = Math.floor((this._img.width > currentWidth ? currentWidth : this._img.width) / this.difficulty)
        this._pieceHeight = Math.floor((this._img.height > currentHeight ? currentHeight : this._img.height) / this.difficulty)
        this._puzzleWidth = this._pieceWidth * this.difficulty
        this._puzzleHeight = this._pieceHeight * this.difficulty

        console.log( `Onimage currentWidth ${currentWidth}`)
        console.log( `Onimage image width ${this._img.width}`)      
        
        console.log( `Onimage puzzle width ${this._puzzleWidth}`)
        this.setCanvas();
        this.initPuzzle();
    }
    setCanvas(){
        console.log("hello")
        console.log( `setcanvas image width ${this._img.width}`) 
        
        this._canvas.width = this._puzzleWidth;
        this._canvas.height = this._puzzleHeight;
        this._canvas.style.border = "1px solid black";
        this._canvas.style.display = "block"
        this.canvasWrap.width = this._canvas.width
        this.canvasWrap.height = this._canvas.height
        console.log(this._canvas.width)
    }
    initPuzzle(){
        this._pieces = [];
        this._mouse = {x:0,y:0};
        this._currentPiece = null;
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
            piece.checked = "false"
            this._pieces.push(piece);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        this.setMaxScore = this._pieces.length + 3
        console.dir(this._pieces)
        document.onmousedown = this.shufflePuzzle();
    }
    shufflePuzzle(){        
        console.log( `shufflePuzzle image width ${this._img.width}`) 
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
        this._canvas.onmousedown = this.onPuzzleClick.bind(this);
    } 
    onPuzzleClick(e){
        console.log("click")
        if(e.offsetX || e.offsetX == 0){
            this._mouse.x = e.offsetX - this._canvas.offsetLeft;
            this._mouse.y = e.offsetY - this._canvas.offsetTop;
        }
        this._currentPiece = this.checkPieceClicked();
        if(this._currentPiece != null){
            this._stage.clearRect(this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);
            this._stage.save();
            console.log(`sx ${this._currentPiece.sx} sy ${this._currentPiece.sy} xPos ${this._currentPiece.yPos} yPos ${this._currentPiece.yPos}`)
            console.log(`e.layerX ${e.layerX} e.offsetX ${e.offsetX} canvas.offsetLeft ${this._canvas.offsetLeft} `)
            this._stage.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight, this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);   
        }
    }
    checkPieceClicked(){
        console.log("check piece clicked")
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            if(this._mouse.x > piece.xPos && this._mouse.x < (piece.xPos + this._pieceWidth) && 
                this._mouse.y > piece.yPos && this._mouse.y < (piece.yPos + this._pieceHeight)){
                    if(piece.checked === "false"){
                         console.log(`piece ${piece}`)
                        piece.checked = "true"
                        this.setMaxScore -= 1
                        document.body.dispatchEvent(new Event ("count"))
                        return piece;
                    }                   
            }            
        }
        return null;
    }
    openRandomPiece(){
        console.log("open random")
        if(this.coins < 12) return
        let closedPieces = []
        console.log(closedPieces)
        for(let piece of this._pieces){
            if (piece.checked === "false") 
                closedPieces.push(piece)
        }
        let randomNum = Math.floor(Math.random() * closedPieces.length)
        this._currentPiece = closedPieces[randomNum]
        for(let elem of this._pieces){
            if (JSON.stringify(elem) === JSON.stringify(this._currentPiece)) 
                elem.checked = "true"
        }  
        this._stage.clearRect(this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);
        this._stage.save();
        this._stage.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight, this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);      
        this.coins -= 12
        document.body.dispatchEvent(new Event ("count"))
    }

    checkWin(){ 
        let map 
        var startXpos = Math.abs(this._img.width - this._puzzleWidth) / 2
        var startYpos = Math.abs(this._img.height - this._puzzleHeight) / 2         
        if(this.counter >= 3){                  
            this._stage.drawImage(this._img, startXpos, startYpos, this._puzzleWidth, this._puzzleHeight, 0, 0, this._puzzleWidth, this._puzzleHeight)
            map = document.body.appendChild(document.createElement("game-over"))
            map.setRes(this.counter, 0, this.coins, false) 
            this.resetControls()
            this.counter = 0
            this.setMaxScore = 0
            document.body.dispatchEvent(new Event ("count"))
            
        } else { 
            if((this.guessInput.value.toUpperCase() !== this.currentPict.name.toUpperCase())){
                let tryAgain = this.createElem("p", this.wrapper)
                tryAgain.innerText = `Try again! You have ${5 - this.counter} attempts left`
                tryAgain.style = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    -ms-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                    width: 90%;
                    height: 80vh;
                    font-size: 2em;
                    font-weight: 500;
                    line-height: 80vh;
                    background-color: #dc251f;
                    color: #fafafa;
                    -webkit-border-radius: 10px;
                        border-radius: 10px;
                `
                this.counter += 1
                this.setMaxScore -= 1
                document.body.dispatchEvent(new Event ("count"))
                setTimeout(function(){
                    tryAgain.parentNode.removeChild(tryAgain)
                }, 3000)
            } else {
                this._stage.drawImage(this._img, startXpos, startYpos, this._puzzleWidth, this._puzzleHeight, 0, 0, this._puzzleWidth, this._puzzleHeight)
                this.coins += this.setMaxScore
                document.body.dispatchEvent(new Event ("win"))
                map = document.body.appendChild(document.createElement("game-over"))
                map.setRes(this.counter, this.setMaxScore, this.coins, true, this.currentPict.mapUrl)                
                this.counter = 0
                this.setMaxScore = 0
                document.body.dispatchEvent(new Event ("count"))
                this.resetControls()
            } 
        }
    }

    resetControls(){
        this.difficulty = null
        this.difficultySelection.value = this.levels[0].name
        this.guessInput.value = null
        this.guessWrapper.style.display = "none"
        this.openPiece.style.display = "none"
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