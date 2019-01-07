class GameOver extends HTMLElement{
    constructor(_counter=1, _score=100, _result=false){
        super()
        this.fullScreenWrap = createElem( "div" )
        this.fullScreenWrap.id = "full_screen_wrap"
        this.wrap = createElem( "div", this.fullScreenWrap )
        this.wrap.id = "wrap"     
        this.cross = createElem( "p", this.wrap )
        this.cross.id = "cross"
        this.cross.innerHTML = 'X'
        this.setRes = (_counter=1, _score=100, _coins=100, _result=false, mapUrl) =>{
            this.resTitle = createElem( "h3", this.wrap )
            this.resTitle.innerText = !_result ? "Oops... This time you loose. Try again!" : "Congratulations! You win!"
            this.statistics = createElem( "p", this.wrap )
            this.statistics.innerHTML = `Attempts: ${_counter} <br> Game score: ${_score} <br> Coins available: ${_coins}`

            this.mapWrap = createElem( "div", this.wrap )
            this.mapWrap.id = "mapWrap"
            this.map = !_result ? createElem( "img", this.mapWrap ) : createElem( "iframe", this.mapWrap )
            this.map.id = "map"
            this.map.src =  !_result ? "https://sus.org/wp-content/themes/sus/assets/images/bgs/sus-landing-skyline.png" : mapUrl
            this.map.innerHTML = 'width="100%" height="600" frameborder="0" style="border:0" allowfullscreen=""'

            TweenMax.fromTo(this.wrap, 2, {backgroundColor: "grey"}, {backgroundColor: "#108d92"})
            TweenMax.fromTo(this.resTitle, 2, {color: " #555555"}, {color: "#ffffff"})
            TweenMax.fromTo(this.statistics, 2, {color: " #555555"}, {color: "#ffffff"})
        } 

        this.closeRes = () => {
            this.fullScreenWrap.parentNode.removeChild(this.fullScreenWrap)
            
        }
        this.cross.onclick = this.closeRes

        let style = document.createElement ( 'style' )
        style.textContent = `
            h3{
                font-family: 'Montserrat';
                font-size: 2em;
                color: #555555;
            }
            p{
                font-family: 'Montserrat';
                font-size: 1.25em;
                color: #555555;
            }
            #cross{
                cursor: pointer;
                display: block;
                width: 25px;
                height: 25px;                
                position: absolute;
                top: -15px;
                right: -30px;                
                z-index: 20; 
                font-size: 1.25em;
                color: #000000;
            }
            #full_screen_wrap{
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #808080cc;
            }
            #wrap{
                display: block;
                position: absolute;
                width: 80%;
                height: 80%;
                top: 50%;
                left: 50%; 
                background-color: #d0d0d0; 
                text-align: center;              
                -webkit-transform: translate(-50%, -50%);
                    -ms-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                -webkit-box-shadow: 0 20px 20px 10px rgba(0, 0, 0, 0.5);
                        box-shadow: 0 20px 20px 10px rgba(0, 0, 0, 0.5);
                -webkit-border-radius: 10px;
                        border-radius: 10px;
                -webkit-animation: show 1s linear;
                        animation: show 1s linear;
            }
            #mapWrap{
                position: absolute;
                width: 90%;
                height: 70%;
                top: 60%;
                left: 50%;
                overflow: hidden;
                -webkit-transform: translate(-50%, -50%);
                    -ms-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                -webkit-border-radius: 10px;
                    border-radius: 10px;
            }
            #map{
                width: 100%;
                height: 100%;
            }`
            this.shadow = this.attachShadow ( { mode: 'open' } )
            this.shadow.appendChild ( style )
            this.shadow.appendChild ( this.fullScreenWrap )
            function createElem ( tagName, container ) {
                return  ( !container ? document.body : container )
                        .appendChild (
                        document.createElement ( tagName )
                        )
            }            
    }
}

customElements.define("game-over", GameOver)