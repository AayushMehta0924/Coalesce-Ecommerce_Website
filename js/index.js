/*
=============
Navigation
=============
 */
const navOpen = document.querySelector(".nav__hamburger");
const navClose = document.querySelector(".close__toggle");
const menu = document.querySelector(".nav__menu");
const scrollLink = document.querySelectorAll(".scroll-link");
const navContainer = document.querySelector(".nav__menu");

navOpen.addEventListener("click", () => {
  menu.classList.add("open");
  document.body.classList.add("active");
  navContainer.style.left = "0";
  navContainer.style.width = "30rem";
});

navClose.addEventListener("click", () => {
  menu.classList.remove("open");
  document.body.classList.remove("active");
  navContainer.style.left = "-30rem";
  navContainer.style.width = "0";
});

/*
=============
PopUp
=============
 */
const popup = document.querySelector(".popup");
const closePopup = document.querySelector(".popup__close");

if (popup) {
  closePopup.addEventListener("click", () => {
    popup.classList.add("hide__popup");
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      popup.classList.remove("hide__popup");
    }, 500);
  });
}

/*
=============
Fixed Navigation
=============
 */

const navBar = document.querySelector(".navigation");
const gotoTop = document.querySelector(".goto-top");

// Smooth Scroll
Array.from(scrollLink).map((link) => {
  link.addEventListener("click", (e) => {
    // Prevent Default
    e.preventDefault();

    const id = e.currentTarget.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    const navHeight = navBar.getBoundingClientRect().height;
    const fixNav = navBar.classList.contains("fix__nav");
    let position = element.offsetTop - navHeight;

    if (!fixNav) {
      position = position - navHeight;
    }

    window.scrollTo({
      left: 0,
      top: position,
    });
    navContainer.style.left = "-30rem";
    document.body.classList.remove("active");
  });
});

// Fix NavBar

window.addEventListener("scroll", (e) => {
  const scrollHeight = window.pageYOffset;
  const navHeight = navBar.getBoundingClientRect().height;
  if (scrollHeight > navHeight) {
    navBar.classList.add("fix__nav");
  } else {
    navBar.classList.remove("fix__nav");
  }

  if (scrollHeight > 300) {
    gotoTop.classList.add("show-top");
  } else {
    gotoTop.classList.remove("show-top");
  }
});

const localCartStr = localStorage.getItem("cart");
const localCart = JSON.parse(localCartStr);

const cart = localCart || []; // start with empty


const cartBubble = document.getElementById("cart__total");
cartBubble.innerText = cart.length;

const addToCart = (e) => {
  const name = e.getAttribute("data-name");
  const img = e.getAttribute("data-img");
  const price = e.getAttribute("data-price");

  cart.push({ name, img, price });
  cartBubble.innerText = cart.length;

  updateLocalStorage();
};

const updateLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// cart page

const cartHolder = document.getElementById("cart-holder");

let totalAmount = 0;
cart.forEach((item) => {
  totalAmount += parseInt(item.price, 10);

  const node = document.createElement("tr");
  node.innerHTML = `<td class="product__thumbnail">
                                            <a href="#">
                                                <img src="${item.img}" alt="">
                                            </a>
                                        </td>
                                        <td class="product__name">
                                            <a href="#">${item.name}</a>
                                            <br><br>
                                            <small>White/6.25</small>
                                        </td>
                                        <td class="product__price">
                                            <div class="price">
                                                <span class="new__price">Rs. ${item.price}</span>
                                            </div>
                                        </td>
                                        <td class="product__quantity">
                                            <div class="input-counter">
                                                <div>
                                                    <span class="minus-btn">
                                                        <svg>
                                                            <use xlink:href="./images/sprite.svg#icon-minus"></use>
                                                        </svg>
                                                    </span>
                                                    <input type="text" min="1" value="1" max="10" class="counter-btn">
                                                    <span class="plus-btn">
                                                        <svg>
                                                            <use xlink:href="./images/sprite.svg#icon-plus"></use>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="product__subtotal">
                                            <div class="price">
                                                <span class="new__price">Rs. ${item.price}</span>
                                            </div>
                                            <a href="#" class="remove__cart-item">
                                                <svg>
                                                    <use xlink:href="./images/sprite.svg#icon-trash"></use>
                                                </svg>
                                            </a>
                                        </td>
                                   `;
  cartHolder.appendChild(node);
});

const st = document.getElementById("st");
st.innerText = "Rs. " + totalAmount;

const shippingPrice = document.getElementById("ship");
const sPrice = totalAmount / 100;
shippingPrice.innerText = "Rs. " + sPrice.toFixed(2);

const tot = document.getElementById("tot");
const amount = totalAmount + sPrice;
tot.innerText = "Rs. " + amount;

const body = document.getElementsByTagName("body")[0];

const node = document.createElement("div");
node.innerHTML = `
  <dialog style="height: 300px" class="udlg" id="ldialog">
            <h2 style="margin-bottom: 4rem;">Login to Coalesce</h2>
            <div>
                <input id="unm" style="padding: 0 10px; height: 3.5rem; width: 100%; display: block;"
                    type="text" placeholder="your email id">
                    <input id="pwd" style="padding: 0 10px; height: 3.5rem; width: 100%; margin-top: 2rem;"
                        type="text" placeholder="password">
                </div>
            <button onclick="login(this)"
                style="cursor: pointer; position: absolute; bottom: 20px; left: 20px; right: 20px; width: calc(100% - 40px); border:0; height: 3rem; color: white; background-color: black;"
                id="xbutton">Login</button>
        </dialog>
`;
body.appendChild(node);

const ldialog = document.getElementById("ldialog");

const login = async (e) => {
  const email = document.getElementById("unm").value;
  const password = document.getElementById("pwd").value;
  const body = JSON.stringify({
    email,
    password,
  });

  const data = await fetch("http://localhost:8080/api/users/login", {
    method: "post",
    body,
    headers: {
      "content-type": "application/json",
      "content-length": body.length,
    },
  });

  if (data.ok) {
    ldialog.close()

    const d = await data.json();
    const user = d.user;
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    //alert("user is not valid")
  }
};

const openAccount = (e) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    location.href = "account.html";
  } else {
    ldialog.open = true
  }
};
