const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener('click',toggleModal);
close.addEventListener('click',toggleModal);

function toggleModal(){
    modal.classList.toggle("is-open");
}

new WOW().init();

///day1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');
let k = 0;
function toogleModalAuth() {
    modalAuth.classList.toggle("is-open")
}


function autorized () {
    function logOut(){
        login = null;
        localStorage.removeItem('gloDelivery');
        userName.textContent = login;

        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';

        buttonOut.removeEventListener('click', logOut);

        checkAuth();
    }

    userName.textContent = login;
    cartButton.style.display = '';
    buttonAuth.style.display = "none";
    userName.style.display = "block";
    buttonOut.style.display = "block";

    buttonOut.addEventListener('click', logOut);
}
function notAutorized () {
    function logIn (event) {
        if(loginInput.value)
        {
            event.preventDefault();
            login = loginInput.value;

            localStorage.setItem('gloDelivery', login);
            toogleModalAuth();
            buttonAuth.removeEventListener('click', toogleModalAuth);
            closeAuth.removeEventListener('click', toogleModalAuth);
            logInForm.removeEventListener('submit', logIn);
            logInForm.reset();
            checkAuth();
        } else{
            alert("Введіть логін");
            event.preventDefault();
            toogleModalAuth();
        }
    }
    buttonOut.style.display = "none";
    cartButton.style.display = "none";

    buttonAuth.addEventListener('click', toogleModalAuth);
    closeAuth.addEventListener('click', toogleModalAuth);
    logInForm.addEventListener('submit', logIn);
}
function checkAuth() {
    if(login){
        autorized();
    } else {
        notAutorized();
    }
}
checkAuth();