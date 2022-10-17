import Swiper from "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
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
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("gloDelivery");
let k = 0;

const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Помилка за адресою ${url} статус помилки ${response.status}!`
    );
  }
  return await response.json();
};

new WOW().init();

function toggleModal() {
  modal.classList.toggle("is-open");
}

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

function createCardRestaurant(restaraunt) {
  const {
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery,
  } = restaraunt;
  const card = `
  <a
    class="card wow animate__animated animate__fadeInUp"
    data-wow-delay="0.6s"
    data-products="${products}"
    data-name="${name}"
    data-stars="${stars}"
    data-price="${price}"
    data-kitchen="${kitchen}"
  >
    <img src="${image}" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} хв</span>
      </div>
      <div class="card-info">
        <div class="rating">
          <img src="img/star.svg" alt="rating" class="rating-star" />
          ${stars}
        </div>
        <div class="price">від ${price} грн</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
  `;

  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

function createCardGood(goods) {
  const { description, id, image, name, price } = goods;
  const card = document.createElement("div");
  card.className = "card wow animate__animated animate__fadeInUp";
  card.id = id;
  card.setAttribute("data-wow-delay", "0.2s");

  card.addParametr;

  card.insertAdjacentHTML(
    "beforeend",
    `
  <img src="${image}" alt="card" class="card-image" />
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <div class="card-info">
      <div class="ingredietns">
        ${description}
      </div>
    </div>

    <div class="card-buttons">
      <button class="button button-primary">
        <span class="button-card-text">В кошик</span>
        <img
          src="img/store.svg"
          alt="shopping-cart"
          class="card-button-image"
        />
      </button>
      <strong class="card-price-bold">${price} грн</strong>
    </div>
  </div>
  `
  );
  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  const restaraunt = target.closest(".card");
  if (restaraunt) {
    cardsMenu.textContent = "";

    containerPromo.classList.add("hide");
    restaraunts.classList.add("hide");
    menu.classList.remove("hide");
    getData(`./db/${restaraunt.dataset.products}`).then(function (data) {
      data.forEach(createCardGood);
    });
    console.log(restaraunt.dataset.name);
    let element = document.getElementById("menu101");
    element.textContent = restaraunt.dataset.name;
    element = document.getElementById("menu102");
    element.textContent = restaraunt.dataset.stars;
    element = document.getElementById("menu103");
    element.textContent = `від ${restaraunt.dataset.price} грн`;
    element = document.getElementById("menu104");
    element.textContent = restaraunt.dataset.kitchen;
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

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  checkAuth();

  new Swiper(".swiper", {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
  });
}

init();
