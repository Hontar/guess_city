class RegistrationForm extends HTMLElement {
    constructor(){
        super()
        
        this.user = {}
        let avatar
        Object.defineProperty ( this, "avatar", {
            get () {
                return avatar
            },
            set ( newAvatar ) { 
                avatar = newAvatar               
            }
        })
        // this.loadData ( "http://localhost:3000/users" )

        // let currentTime = new Date().toLocaleString().split(", ")

        // this.lastUpdate 

        this.wrapper = this.createElem( "div" )
        this.wrapper.id = "wrapper"

        this.form = this.createElem("form", this.wrapper)
        
        this.titleForm =  this.wrapper.insertBefore(document.createElement("h2"), this.form)
       
        this.titleForm.innerText = `Registration form`     

        this.inputNameLabel = createLabel(this.form, this.inputName, "Your name")
        this.inputName = createInput(this.inputNameLabel, "text", "Name")

        this.emailLabel = createLabel(this.form, this.email, "Your email")
        this.email = createInput(this.emailLabel, "text", "Email")

        this.passwordLabel = createLabel(this.form, this.password, "Your password")
        this.password =createInput(this.passwordLabel, "password", "Password")

        this.passConfirmLabel = createLabel(this.form,  this.passConfirm, "Confirm your password")
        this.passConfirm =createInput(this.passConfirmLabel, "password", "Confirm password")

        this.inputAvatarLabel = createLabel(this.form, this.inputAvatar, "Upload avatar")
        this.inputAvatarLabel.id = "loadAvatar"
        this.inputAvatar = createInput(this.inputAvatarLabel, "file", null)
        this.inputAvatar.style.display = "none"
        this.inputAvatar.onchange = function (event){            
            var file = event.target.files [0]          
            if ( file.type.split('/')[0] !== 'image' ) return                
            var fileReader = new FileReader ()
            fileReader.onload = function ( e ) {                        
                    avatar =  e.target.result                                                       
                }             
            fileReader.readAsDataURL ( file )
        }
        
        function createLabel(container = this.wrapper, forElem, labelText){
            let label = (!container ? document.body : container)
                        .appendChild(
                            document.createElement("label")
                        )
            label.for = forElem
            label.innerHTML = labelText
            return label
        }

        function createInput (containerLabel, inputType, _placeHolder){
            let input = (!containerLabel ? document.body : containerLabel)
                        .appendChild(
                            document.createElement("input")
                        )
            input.type = inputType
            input.placeholder = _placeHolder         
            return input
        }       

        this.btnReg = this.createElem( "a", this.wrapper )
        this.btnReg.innerHTML = `Don't have an account? <span> Sign up </span>`
        this.btnReg.onclick = this.register.bind(this)

        this.btnSignIn = this.createElem( "a", this.wrapper) 
        this.btnSignIn.innerHTML = "Have an account? <span> Sign in </span>" 
        this.btnSignIn.onclick = this.signIn.bind(this)
        
        this.demo = this.createElem( "p", this.form )
        this.demo.id = "demo"

        this.btnSubmit = this.createElem( "button", this.form )
        this.btnSubmit.innerHTML = "submit"
        this.btnSubmit.type = "submit"
        
        this.form.addEventListener("submit", this.testData.bind(this))

        this.btnCancel = this.createElem( "a", this.wrapper )
        this.btnCancel.innerHTML = "Start as a guest" 
        this.btnCancel.id = "cancel"
        this.btnCancel.onclick = function (event){           
            document.body.dispatchEvent ( new Event ( "initMosaic" ) )             
        }

        
        let style = document.createElement ( 'style' )
        style.textContent = `
            *{
                margin: 0;
            }
            span, #cancel, #loadAvatar {
                text-decoration: underline;
                cursor: pointer;
            }
            span:hover{
                color: #6f1741;
            }
            h2{
                font-size: 20px;
                /* color: #ffffff; */                
                font-weight: 700;
                text-align: center;
                padding: 40px 0 40px;
            }
            form, a{
                text-align: center;
            }
           
            #wrapper{
                height: 37vh;
            }            
            #cancel{
                display: block;               
                margin: 10px;
            }
            #demo{
                font-size: 14px;
                font-style: italic;
                color: #c52d76;                
                font-weight: 700;
                text-align: center;
                padding: 10px 0 10px;
            }
            label{
                margin: 10px 10px 10px;
                display: inline-block;
                text-align: center;
            }
            button{
                display: block;
                width: 170px;
                height: 44px;
                cursor: pointer;
                margin: 20px auto 30px auto;
                background-color: #c52d76;
                font-family: 'Montserrat';
                font-size: 12px;
                color: #ffffff;
                text-transform: uppercase;
                border: 1px solid #555555;
                border-radius: 5px;
                text-align: center;
                line-height: 20px;
                letter-spacing: 0.6px;
            }
            button:active, button:focus {
                outline: none !important;
            }
            button::-moz-focus-inner {
                border: 0 !important;
            }
            button:hover{
                background-color: #b10c5b;
                color: #ffffff;
            }
            select{
                margin: 0 10px;
                font-family: 'Montserrat' !important;
                font-size: 12px;
                color: #555555;
                outline: 0;
            }
            input  {
                height: 24px;
                margin: 0 10px;
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
            :focus:-ms-input-placeholder      {color: transparent}              
        `

        this.shadow = this.attachShadow ( { mode: 'open' } )
        this.shadow.appendChild ( style )
        this.shadow.appendChild ( this.wrapper )

        this.addEventListener("start", this.signIn.bind(this))

        
        // this.updateFunc = this.updateData.bind(this)
        // this.interval = setInterval ( function () {
        //     this.updateFunc()
        // }, 500)

    }

         
        createElem (tagName, container){
            return (!container ? document.body : container)
                .appendChild(
                    document.createElement(tagName)
                )
        }
        async loadData (email) {
            let promise = fetch(`http://localhost:3000/users?email=${email}`)
                .then(resp => resp.json())
                    .then(users => this.user = users[0])
            this.user = await promise
                
        }
        getData(ref){
            return fetch("http://localhost:3000/" + ref)
                .then(response => response.json())
        }
        
        clearFields(){
            this.inputName.value = null
            this.email.value = null
            this.password.value = null
            this.form.style.display = "none"
        }
        register (event){
            this.form.style.display = "block" 
            this.inputNameLabel.style.display = "inline-block"
            this.passConfirmLabel.style.display = "inline-block"
            this.btnSignIn.style.display = "block"
            this.btnReg.style.display = "none"            
            this.titleForm.innerHTML = "Registration"
            this.form.status = 0
            console.log(this.form.status )
        }
        signIn (event){    
            this.form.style.display = "block"
            this.btnReg.style.display = "block"
            this.btnSignIn.style.display = "none"  
            this.inputNameLabel.style.display = "none"
            this.passConfirmLabel.style.display = "none"
            this.titleForm.innerHTML = "Sign in"
            this.form.status = 1
            console.log(this.form.status )
        }
        async testData(event){
            event.preventDefault()
            if(!this.email.value || !this.password.value) {
                this.demo.innerHTML = "Enter email and password please"
                return 
            }           
            var userKey = Sha256.hash (this.email.value + this.password.value)
            await this.loadData (this.email.value)
            var presence = !!this.user 
                                 
            console.log(`user ${this.user}`)
            console.log(presence)
            
            if(this.form.status === 0){
                if(!presence){
                    if(this.password.value && this.passConfirm.value && this.password.value === this.passConfirm.value){
                        await fetch ("http://localhost:3000/users",{
                        method: 'POST',
                        body: JSON.stringify({
                            key: userKey,
                            name: this.inputName.value,
                            email: this.email.value,
                            score: 0
                        }),
                        headers: {
                            "content-type": "application/json"
                        }
                    }).then( response => {
                        console.log ( 'response: ', response )
                    })
                    let registerTime = new Date().toLocaleString().split(", ")
                    fetch ('http://localhost:3000/lastUpdate/1',{
                        method: "PUT",
                        body: JSON.stringify({
                            date: registerTime[0],
                            time: registerTime[1]
                        }),
                        headers: {
                            "content-type": "application/json"
                        }
                    })
                    // this.updateData()
                    await this.loadData (this.email.value)                   
                   
                    this.avatar ? localStorage.setItem(`${this.user.name}`, this.avatar) : null
                    console.log(`this avatar storage ${this.avatar}`)
                    

                    this.titleForm.innerHTML = `Registration of new user ${this.inputName.value} was succeessful`
                    this.btnSignIn.style.display = "none"
                    this.btnCancel.style.display = "none"
                    this.clearFields()
                    
                    document.body.dispatchEvent ( new Event ( "initMosaic" ) )
                    } else {
                        this.demo.innerHTML = "Entered passwords don't match"                        
                    }
                    
                } else {
                    this.clearFields()
                    this.titleForm.innerHTML = `User ${this.inputName.value} already exists`
                }
        
            } else {
                if(presence){
                    console.log(this.user.key)
                    if(userKey === this.user.key){
                        var currentUserName = this.user.name
                        this.clearFields()
                        this.titleForm.innerHTML = `Hello ${currentUserName}!`
                        this.btnReg.style.display = "none"
                        this.btnCancel.style.display = "none"   
                        
                        this.avatar ? localStorage.setItem(`${this.user.name}`, this.avatar) : null
                        console.log(`this avatar storage ${this.avatar}`)                
                        document.body.dispatchEvent ( new Event ( "initMosaic" ) )
                    } else {
                        this.demo.innerHTML  = `Incorrect login or password`
                    }
                    
                } else {
                    this.clearFields()
                    this.titleForm.innerHTML = `You are not registered yet.`
                }
            }    
        }
        // async updateData(){            
        //     let updated = await this.getData("lastUpdate")

        //     if( this.lastUpdate && 
        //         updated.data === this.lastUpdate.data &&
        //         updated.time === this.lastUpdate.time
        //     )
        //     return

        //     await this.getData("users").then(x => this.users = x)

        //     this.lastUpdate = {
        //         data: updated.data,
        //         time: updated.time
        //     }
        // }
    
};

customElements.define("registration-form", RegistrationForm)



