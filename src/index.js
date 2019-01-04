'use strict'

let currentUser = null
let header = document.querySelector("header")
let initialImg = null
let elem = null



document.onload = initRegistration(event)


function initRegistration(event){
    customElements.whenDefined( "registration-form" )
        .then( () => {
            elem = document.querySelector("#wrapper").insertBefore (
                document.createElement ( "registration-form" ), initialImg
            )        
            elem.dispatchEvent ( new Event ( "start" ) ) 
               
            
        })
    header.style.backgroundColor = "#2bab83"
    document.body.addEventListener("initMosaic", initMosaic )
    initialImg = addElem("img", document.querySelector("#wrapper"))
    initialImg.alt = "city skyline"
    initialImg.id = "initial_img"
    initialImg.src="https://cdn130.picsart.com/280738576019211.png?r480x480"
    initialImg.style = `  
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 3%;
      `
}

function initMosaic(event){
    currentUser = elem.user.name ? elem.user : {name: "Guest"}
    
    console.log(currentUser)
    customElements.whenDefined( "guess-mosaics" )
        .then( () => {
            document.querySelector("registration-form").parentNode.removeChild(document.querySelector("registration-form"))
            let mosaics = document.querySelector("#wrapper").insertBefore (
                document.createElement ( "guess-mosaics" ), initialImg
            )
            var userProfile = addElem("div", header)
            userProfile.style = `
                position: absolute;
                top: 10px;
                right: 10%;
            `
            var userName = addElem ("p", userProfile)
            userName.style = `
                font-size: 1.25em;
                font-weight: 500;
                color: #fafafa;
            `
            var userScore = addElem ("p", userProfile)
            userScore.style = `
                font-size: 1.25em;
                font-weight: 500;
                color: #fafafa;
            `
            userName.innerHTML = `${currentUser.name}` 
            userScore.innerHTML = `Attempts ${mosaics.counter}` 
            document.body.addEventListener("count", updateScore)
            function updateScore(){
                userScore.innerHTML = `Attempts ${mosaics.counter}` 
            }
                   
            // elem.dispatchEvent ( new Event ( "start" ) )            
        })
    
    
    header.style.backgroundColor = "#19a1b5"
    
}

function addElem (tagName, container){
    return (!container ? document.body : container)
        .appendChild(
            document.createElement(tagName)
        )
}