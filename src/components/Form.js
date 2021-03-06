import gsap from 'gsap';
const axios = require('axios');
const apiPath = 'https://iot.dukefromearth.com/products/bearwithme'


export default class Form {
    constructor(_getCB, _sentCB) {
        this.form = document.querySelector("form");
        this.form.addEventListener("submit", this.onSubmit.bind(this));

        this.closeArea = document.getElementById("closeArea");
        this.submitBTN_Hug = document.getElementById("submitCTA-Hug");
        this.submitBTN_Kiss = document.getElementById("submitCTA-Kiss");
        this.info = document.getElementById("info");
        this.close = document.getElementById("close");
        this.chat = document.getElementById("chat");

        this.closeArea.addEventListener("click", this.onCloseLetter.bind(this));
        this.close.addEventListener("click", this.onCloseLetter.bind(this));
        this.close.addEventListener("mouseover", this.onCloseHover.bind(this, true));
        this.close.addEventListener("mouseout", this.onCloseHover.bind(this, false));
        
        this.submitBTN_Hug.addEventListener("mouseover", this.setType.bind(this,'hug'));
        this.submitBTN_Kiss.addEventListener("mouseover", this.setType.bind(this, 'kiss'));

        this.email = document.getElementById("info");
        this.email.addEventListener("mouseover", this.onEmailHover.bind(this, true));
        this.email.addEventListener("mouseout", this.onEmailHover.bind(this, false));

        this.type = 'hug';

        this.main = document.querySelector("main");
        this.getCB = _getCB;
        this.sentCB = _sentCB;
        this.showingOldLetter = false;
        this.forBear = '';
        this.getLetters();
        this.letterDOMS = [];
        this.currentIdx = 0;
        this.resetDOM();
    }

    setType(type){
        this.type = type;
    }

    resetDOM(){
        gsap.to(this.info, {rotation: -40, x: '-100%'});
        gsap.to(this.close, {rotation: 40, x: '100%'});
    }

    onCloseHover(over){
        if(over){
            this.form.classList.add('formContainer--hoverno')
        } else {
            this.form.classList.remove('formContainer--hoverno')
        }
    }
    onEmailHover(over){
        if(over){
            this.chat.classList.add('chat-email')
        } else {
            this.chat.classList.remove('chat-email')
        }
    }

    addLetterToDom(msgs) {
        let main = document.querySelector("main");
        let letterContainer = document.createElement("div");
        letterContainer.classList.add('oldLetter');
        main.appendChild(letterContainer);

        let msgField = document.createElement("p");
        msgField.classList.add('oldLetterText');
        msgField.innerHTML = msgs.data.message ? msgs.data.message : 'just a hug';
        letterContainer.appendChild(msgField);

        let nameField = document.createElement("p");
        nameField.classList.add('oldLetterName');
        nameField.innerHTML = msgs.data.name ? msgs.data.name : 'a mysterious person';
        letterContainer.appendChild(nameField);

        let locationField = document.createElement("p");
        locationField.classList.add('oldLetterLocation');
        locationField.innerHTML = msgs.data.location ? msgs.data.location : 'somewhere in the world';
        letterContainer.appendChild(locationField);

        this.letterDOMS.push(letterContainer);
    }


    getLetters() {
        axios.get(apiPath)
            .then((res) => {
                this.getCB(res.data, true);
            })
            .catch((error) => {
                console.error(error)
            })
    }

    postLetters(msg) {
        // this.postComplete();
        // this.getCB(msg, false);
        axios.post(apiPath, msg)
          .then((res) => {
              console.log(msg)
              this.postComplete();
              this.getCB(msg, false);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    emptyForm(){
        this.form.elements["fname"].value = '';
        this.form.elements["femail"].value = '';
        this.form.elements["fmessage"].value= '';
        this.form.elements["flocation"].value= '';
        this.main.classList.remove('active-form');
        this.main.classList.remove('active-letter')
        this.chat.classList.remove('chat-thanks');
        this.chat.classList.remove('chat-error');
    }

    postComplete(){
        this.chat.classList.add('chat-thanks');
        this.resetDOM();
        gsap.to(this.form, {rotation: 10, y: "-150%", duration: 0.5, delay: 1, onComplete: ()=>{
            gsap.set(this.chat, {opacity: 0});
            this.emptyForm();
            this.sentCB();
        }});
    }

    
    showOldLetter(idx){
        this.currentIdx = idx;
        this.main.classList.add('active-letter');
        this.showingOldLetter = true;
        gsap.fromTo(
            this.letterDOMS[idx], {
                rotation: 10, 
                x: 0,
                y: "-200%", 
                opacity: 1,
            }, 
            { 
                rotation: -10, 
                x: 0, 
                y: "20%", 
                duration: 0.6,
                ease: "power3.out",
            }
        );
    }

    hideOldLetter(){
        let l = this.letterDOMS[this.currentIdx]; 
        gsap.to(
            l, {
                rotation: 10, 
                x: 0, 
                y: "-200%", 
                opacity: 0, 
                duration: 0.6, 
                ease: "power3.in",
                onComplete: ()=>{
                    this.showingOldLetter = false;
                    this.main.classList.remove('active-letter')
                }
            }, 
        );
    }
     

    onCloseLetter() {
       if (this.showingOldLetter){
        this.hideOldLetter();
       } else {
        this.resetDOM();
        gsap.to(
            this.form, {
                rotation: 10, 
                x: 0, 
                y: "300%", 
                opacity: 1, 
                duration: 0.6, 
                ease: "power3.in",
                onComplete: ()=>{
                    this.main.classList.remove('active-form')
                    this.emptyForm();
                }
            }, 
        );
       }
    }

    show(bear){
        this.forBear = bear;
        this.main.classList.add('active-form')
        gsap.to(this.info, {rotation: 0, x: '0%', duration: 0.5, delay: 0.5, ease: "power3.out",});
        gsap.to(this.close, {rotation: 0, x: '0%', duration: 0.5, delay: 0.5, ease: "power3.out",});
        gsap.fromTo(
            this.form, 
            {rotation: -10, x: 0, y: "300%", opacity: 1}, 
            {rotation: -2,  x: 0, y: "0%", duration: 0.6, ease: "power3.out"}
        );
    }

    validated(email){
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onSubmit(e){
        e.preventDefault();
       
        let form = e.target;
        let name = form.elements["fname"].value;
        let email = form.elements["femail"].value;
        let message = form.elements["fmessage"].value;
        let location = form.elements["flocation"].value;
        let test = message === '' && name === '' && location === '';

        let msg = {
            id: test ? 'empty' : Date.now() + Math.floor(Math.random() * 100),
            data: {
                name: name === '' ? 'an angel' : name,
                message: message === '' ? 'here is some love' : message,
                location: location === '' ? 'heaven' : location,
                type: this.type,
            },
            hasPlayed: "false",
            email: email === '' ? 'empty@email.com' : email
        }

        if(msg.email === '' || this.validated(msg.email)){
            this.chat.classList.remove('chat-error');
            this.postLetters(msg);
            this.clearURL();
        } else {
            this.emailError();
        }
    }

    clearURL(){
        const url = new URL(location);
        url.searchParams.delete('fmessage');
        url.searchParams.delete('fname');
        url.searchParams.delete('flocation');
        url.searchParams.delete('femail');
        history.replaceState(null, null, url)
    }
    
    emailError(){
        this.chat.classList.add('chat-error');
    }

    setPos(pos){
        this.position = pos;
    }

    setSize(size){
        this.scale.set(size);
    }


}