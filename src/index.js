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
            elem.style.zIndex = "15"
               
            
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
        height: 45%;
        z-index: 0;
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
            mosaics.coins = elem.user.name ? currentUser.score : 0
            var userProfile = addElem("div", header)
            userProfile.style = `
                position: absolute;
                top: 10px;
                right: 20%;
                display: flex;
            `
            var userAvatar = addElem ("img", userProfile)
            console.log(currentUser.name)
            userAvatar.src = currentUser.name === "Guest" || localStorage.getItem(`${currentUser.name}`) === "indefined" || !localStorage.getItem(`${currentUser.name}`) ?
                "https://cdn.icon-icons.com/icons2/865/PNG/512/Citycons_building_icon-icons.com_67935.png" : localStorage.getItem(`${currentUser.name}`)
            userAvatar.style = `
                height: 50px;
                margin-right: 10px;
            `
            var userData = addElem ("div", userProfile)
            var userName = addElem ("p", userData)
            userName.style = `
                font-size: 1.2em;
                font-weight: 500;
                color: #ffffff;
            `
            var userScore = addElem ("p", userData)
            userScore.style = `
                font-size: 0.8em;
                font-weight: 500;
                color: #ffffff;
            `
            userName.innerHTML = `${currentUser.name}` 
            userScore.innerHTML = `Attempts left: ${3- mosaics.counter} <br> 
                Coins available: ${mosaics.coins}` 
            document.body.addEventListener("count", updateScore)
            function updateScore(){
                userScore.innerHTML = `Attempts left: ${3 - mosaics.counter} <br> 
                Coins available: ${mosaics.coins}` 
            }
            document.body.addEventListener("win", uploadScore)
            function uploadScore(){               
                console.log(`http://localhost:3000/users/${currentUser.id}`)
                if(!elem.user.name) return
                fetch (`http://localhost:3000/users/${currentUser.id}`,{
                    method: "PATCH",
                    body: JSON.stringify({                        
                        score: mosaics.coins
                    }),
                    headers: {
                        "content-type": "application/json"
                    }
                })
            }
                       
        })
    
    TweenMax.to(header, 2, {backgroundColor: "#14818d"})
    // header.style.backgroundColor = "#14818d"
    
}

function addElem (tagName, container){
    return (!container ? document.body : container)
        .appendChild(
            document.createElement(tagName)
        )
}