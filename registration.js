class RegistrationForm extends HTMLElement {
    constructor(){
        super()
        this.users = []
        this.loadData ( "http://localhost:3000/users" )

        // let currentTime = new Date().toLocaleString().split(", ")

        this.lastUpdate 

        this.wrapper = this.createElem( "div" )

        this.form = this.createElem("form", this.wrapper)
        
        this.titleForm =  this.wrapper.insertBefore(document.createElement("h1"), this.form)

        // document.querySelector ( '#form-name' ).innerText = `Registration form`  
        this.titleForm.innerText = `Registration form`     

        this.inputNameLabel = createLabel(this.form, this.inputName, "Your name")
        this.inputName = createInput(this.inputNameLabel, "text", "Name")

        this.emailLabel = createLabel(this.form, this.email, "Your email")
        this.email = createInput(this.emailLabel, "text", "Email")

        this.passwordLabel = createLabel(this.form, this.password, "Your password")
        this.password =createInput(this.passwordLabel, "text", "Password")
        
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

        this.btnSubmit = this.createElem( "button", this.form )
        this.btnSubmit.innerHTML = "submit"
        this.btnSubmit.type = "submit"
        
        this.form.addEventListener("submit", this.testData.bind(this))

        
        let style = document.createElement ( 'style' )
        style.textContent = `
            span {
                text-decoration: underline;
                cursor: pointer;
            }
        `,

        this.shadow = this.attachShadow ( { mode: 'open' } )
        this.shadow.appendChild ( style )
        this.shadow.appendChild ( this.wrapper )

        this.addEventListener("start", this.signIn.bind(this))

        
        this.updateFunc = this.updateData.bind(this)
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
        async loadData (jsonURL) {
            let promise = fetch ( jsonURL )
                        .then ( response => response.json() )
            this.users = await promise
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
            this.inputNameLabel.style.display = "block"
            this.btnSignIn.style.display = "block"
            this.btnReg.style.display = "none"
            // this.inputName.style.display = "block"
            this.titleForm.innerHTML = "Registration"
            this.form.status = 0
            console.log(this.form.status )
        }
        signIn (event){    
            this.form.style.display = "block"
            this.btnReg.style.display = "block"
            this.btnSignIn.style.display = "none"  
            this.inputNameLabel.style.display = "none"
            this.titleForm.innerHTML = "Sign in"
            this.form.status = 1
            console.log(this.form.status )
        }
        testData(event){
            event.preventDefault()
            if(!this.email.value || !this.password.value) return
            console.log(this.users)
            var userKey = Sha256.hash (this.email.value + this.password.value)
            var presence = this.users.some(function(x){
                            return x.key === userKey
                        })
            console.log(presence)
            if(this.form.status === 0){
                if(!presence){
                    fetch ("http://localhost:3000/users",{
                        method: 'POST',
                        body: JSON.stringify({
                            key: userKey,
                            name: this.inputName.value,
                            email: this.email.value
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
                    this.updateData()

                    this.titleForm.innerHTML = `Registration of new user ${this.inputName.value} was succeessful`
                    this.btnSignIn.style.display = "none"
                    this.clearFields()
                } else {
                    this.clearFields()
                    this.titleForm.innerHTML = `User ${this.inputName.value} already exists`
                }
        
            } else {
                if(presence){
                    var currentUserName = this.users.filter(
                        function(x){
                            return x.key === userKey
                        }
                    )[0].name
                    this.clearFields()
                    this.titleForm.innerHTML = `Hello ${currentUserName}!`
                    this.btnReg.style.display = "none"
                } else {
                    this.clearFields()
                    this.titleForm.innerHTML = `You are not registered yet.`
                }
            }    
        }
        async updateData(){            
            let updated = await this.getData("lastUpdate")

            if( this.lastUpdate && 
                updated.data === this.lastUpdate.data &&
                updated.time === this.lastUpdate.time
            )
            return

            await this.getData("users").then(x => this.users = x)

            this.lastUpdate = {
                data: updated.data,
                time: updated.time
            }
        }
    
};

customElements.define("registration-form", RegistrationForm)

customElements.whenDefined( "registration-form" )
    .then( () => {
        let elem = document.body.appendChild (
            document.createElement ( "registration-form" )
        )        
        elem.dispatchEvent ( new Event ( "start" ) )
        
    })

