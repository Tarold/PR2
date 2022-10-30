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
const restarauntTitle = document.getElementById("menu101");
const restarauntRating = document.getElementById("menu102");
const restarauntPrice = document.getElementById("menu103");
const restarauntCategory = document.getElementById("menu104");
const starRating = document.getElementById("menu105");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPriceTag = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

let login = localStorage.getItem("gloDelivery");

let cart = getLocalStorage();

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

function getLocalStorage() {
  let task = localStorage.getItem("gloDeliveryCart");
  if (task) {
    return (task = JSON.parse(localStorage.getItem("gloDeliveryCart")));
  } else {
    return [];
  }
}

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
      <button class="button button-primary button-cardd">
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

    restarauntTitle.textContent = restaraunt.dataset.name;
    restarauntRating.textContent = restaraunt.dataset.stars;
    restarauntPrice.textContent = `від ${restaraunt.dataset.price} грн`;
    restarauntCategory.textContent = restaraunt.dataset.kitchen;
    starRating.classList.remove("hide");

    getData(`./db/${restaraunt.dataset.products}`).then(function (data) {
      data.forEach(createCardGood);
    });
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

function addToCart(event) {
  const target = event.target;

  const buttonAddToCard = target.closest(".button-primary");

  if (buttonAddToCard) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price-bold").textContent;
    const id = card.id;

    let cart = getLocalStorage();
    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
    localStorage.setItem("gloDeliveryCart", JSON.stringify(cart));
  }
}

function renderCart() {
  cart = getLocalStorage();
  console.log("cart", cart);
  modalBody.textContent = "";

  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${id}>-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus"data-id=${id}>+</button>
      </div>
    </div>
    `;

    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPriceTag.textContent = totalPrice + " грн";
}

function changeCount(event) {
  const target = event.target;
  cart = getLocalStorage();
  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    console.log("food", cart);
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains("counter-plus")) food.count++;
    localStorage.setItem("gloDeliveryCart", JSON.stringify(cart));
    renderCart();
  }
}

function init() {
  cart;

  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    localStorage.setItem("gloDeliveryCart", JSON.stringify(cart));
    renderCart();
  });
  modalBody.addEventListener("click", changeCount);
  cardsMenu.addEventListener("click", addToCart);

  close.addEventListener("click", toggleModal);

  checkAuth();

  new Swiper(".swiper", {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
  });

  inputSearch.addEventListener("keypress", function (event) {
    if (event.charCode == 13) {
      const value = event.target.value;

      if (!value) {
        event.target.classList.add("red");
        event.target.value = "";
        setTimeout(function () {
          event.target.classList.remove("red");
        }, 1500);
        return;
      }
      getData("./db/partners.json")
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = "";

          linksProduct.forEach(function (link) {
            getData(`./db/${link}`).then(function (data) {
              const resultSearch = data.filter(function (item) {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });

              containerPromo.classList.add("hide");
              restaraunts.classList.add("hide");
              menu.classList.remove("hide");

              starRating.classList.add("hide");
              restarauntTitle.textContent = "Результат поиска";
              restarauntRating.textContent = "";
              restarauntPrice.textContent = "";
              restarauntCategory.textContent = "разная кухня";
              resultSearch.forEach(createCardGood);
            });
          });
        });
    }
  });
}

init();
