const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

new WOW().init();

///day1

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards");
const containerPromo = document.querySelector(".container-promo");
const restaraunts = document.querySelector(".restaraunts");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
// const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("gloDelivery");
let k = 0;
function toogleModalAuth() {
  modalAuth.classList.toggle("is-open");
  if (modalAuth.classList.contains("is-open")) {
    disabledScroll();
  } else {
    enableScroll();
  }
  loginInput.style.borderColor = "";
}

function autorized() {
  function logOut() {
    login = null;
    localStorage.removeItem("gloDelivery");
    userName.textContent = login;

    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";

    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  }

  userName.textContent = login;
  cartButton.style.display = "";
  buttonAuth.style.display = "none";
  userName.style.display = "block";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}
function notAutorized() {
  function logIn(event) {
    event.preventDefault();
    if (loginInput.value) {
      login = loginInput.value;
      localStorage.setItem("gloDelivery", login);
      toogleModalAuth();
      buttonAuth.removeEventListener("click", toogleModalAuth);
      closeAuth.removeEventListener("click", toogleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "#ff0000";
      loginInput.value = "";
    }
  }
  buttonOut.style.display = "none";
  cartButton.style.display = "none";

  buttonAuth.addEventListener("click", toogleModalAuth);
  closeAuth.addEventListener("click", toogleModalAuth);
  logInForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", function (event) {
    if (event.target.classList.contains("is-open")) {
      toogleModalAuth();
    }
  });
}
function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}
checkAuth();

function createCardRestaurant() {
  const card = `
  <a
    class="card wow animate__animated animate__fadeInUp"
    data-wow-delay="0.6s"
  >
    <img src="img/card3.png" alt="card" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Lawca Pizza</h3>
        <span class="card-tag tag">20 хв</span>
      </div>
      <div class="card-info">
        <div class="rating">
          <img src="img/star.svg" alt="rating" class="rating-star" />
          4.5
        </div>
        <div class="price">від 110 грн</div>
        <div class="category">Піцца</div>
      </div>
    </div>
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

createCardRestaurant();

function openGoods(event) {
  const target = event.target;

  const restaraunt = target.closest(".card");
  if (restaraunt) {
    containerPromo.classList.add("hide");
    restaraunts.classList.add("hide");
    menu.classList.remove("hide");
  }
}

cardsRestaurants.addEventListener("click", function (event) {
  if (!login) {
    toogleModalAuth();
  } else {
    openGoods(event);
  }
});

logo.addEventListener("click", function () {
  containerPromo.classList.remove("hide");
  restaraunts.classList.remove("hide");
  menu.classList.add("hide");
});
