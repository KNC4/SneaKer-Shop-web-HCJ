import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQkAmoLQmmtwaJt-mjaDaXDYxAMF2Gqcw",
  authDomain: "myflutterapp-6b77d.firebaseapp.com",
  projectId: "myflutterapp-6b77d",
  storageBucket: "myflutterapp-6b77d.appspot.com",
  messagingSenderId: "471368282825",
  appId: "1:471368282825:web:cced1ad4a5994fbe74d318",
};
//cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(); // get the firestore instance
const shoesCollection = collection(firestore, "shoes"); //shoes collection
var shoelist = [];
var mycart = [];
//open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};
//close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (document.readyState === "complete") {
      ready();
      return;
    }
  });
}
function SwalAlert(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    color: "#e6e6e6",
    confirmButtonText: "Ok",
    confirmButtonColor: "#f6f6f6",
    customClass: {
      confirmButton: "main-button",
    },
    background: "#222222",
  });
}
function addToCart(id) {
  console.log("received id: " + id);
  let itemFound = false;
  for (let index = 0; index < shoelist.length; index++) {
    if (shoelist[index].id == id && shoelist[index].cart == false) {
      console.log("item added");
      shoelist[index].cart = true;
      mycart.push(shoelist[index]);
      console.log(mycart);

      document.getElementById("cartItems").innerHTML += `
      <div class="cart-box">
      <img src="${shoelist[index].imagePath}" alt="" class="cart-img">
      <div class="detail-box">
      <span class="cart-product-title ">${shoelist[index].name}</span>
          <div class="cart-price">$${shoelist[index].price}</div>
          <input type="number" value="1" class="cart-quantity">
      </div>
          <!-- Remove -->
          <i class='bx bxs-trash-alt cart-remove'></i>
          </div>
          `;

      itemFound = true;
      SwalAlert("success", "Good choice", "Item added to the cart");
      break; // Se sale del bucle al encontrar el elemento
    }
  }
  if (!itemFound) {
    // Si no se encontró el elemento, muestra el Swal
    SwalAlert("error", "Opps!", "Item already in the cart");
    console.log("item already added");
  }
}

async function ready() {
  showLoadingMask();
  await new Promise((resolve) => {
    //listen the database changes on real time
    onSnapshot(shoesCollection, (snapshot) => {
      //get the products data
      shoelist = snapshot.docs.map((doc) => doc.data());
      // do something with tha data
      console.log(shoelist);
      for (let index = 0; index < shoelist.length; index++) {
        const shoeId = snapshot.docs[index].id;
        console.log(shoeId);
        shoelist[index].id = shoeId;
        document.getElementById("startShoes").innerHTML += `
          <div class="product-box">
            <img src="${shoelist[index].imagePath}" alt="" class="product-img" />
            <h2 class="product-title">${shoelist[index].name}</h2>
            <span class="price">$${shoelist[index].price}</span>
            <button class="add-cartbtn"><i class="bx bxs-shopping-bag"></i></button>
          </div>`;
        // add onclick
      }
      document.querySelectorAll(".add-cartbtn").forEach((button, index) => {
        button.addEventListener("click", function () {
          const shoeId = snapshot.docs[index].id;
          addToCart(shoeId);
        });
      });
      // resolve para indicar que la promesa está completa
      resolve();
    });
  });
}

// call ready() to wait for onsnapshot and then execute
ready().then(() => {
  //remove from cart
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  console.log(removeCartButtons);
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  //quantity changes
  var quatityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quatityInputs.length; i++) {
    var input = quatityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  //Add to cart
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  //buy button
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
  hideLoadingMask();
});

// loading mask
function showLoadingMask() {
  var loadingMask = document.createElement("div");
  loadingMask.innerHTML = "Loading Shop...";
  loadingMask.classList.add("loading-mask");
  loadingMask.classList.add("fade-in");
  document.body.appendChild(loadingMask);
}
function hideLoadingMask() {
  setTimeout(function () {
    var loadingMask = document.querySelector(".loading-mask");
    loadingMask.classList.add("fade-out");
    setTimeout(function () {
      loadingMask.parentNode.removeChild(loadingMask);
    }, 1000);
  }, 1000);
}
//buy function
function buyButtonClicked(event) {
  alert("Your order is placed");
  var cartContent = document.getElementsByClassName("cart-content")[0];
  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }
  updateTotal();
}

//remove item from cart
function removeCartItem() {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateTotal();
}
//quatity changes
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
}
//add to cart
function addCartClicked(event) {
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImage = shopProducts.getElementsByClassName("product-img")[0].src;
  addProductToCart(title, price, productImage);
  updateTotal();
}
//add to the cart
function addProductToCart(title, price, productImage) {
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemsNames = document.getElementsByClassName("cart-product-title");
  for (var i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      alert("This item is already in the cart");
      return;
    }
  }
  var cartBoxContent = `
    <img src="${productImage}" alt="" class="cart-img">
    <div class="detail-box">
    <span class="cart-product-title ">${title}</span>
        <div class="cart-price">${price}</div>
        <input type="number" value="1" class="cart-quantity">
    </div>
        <!-- Remove -->
        <i class='bx bxs-trash-alt cart-remove'></i>
    `;
  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
}

//update total
function updateTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total += price * quantity;
  }
  //if price has cents
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

// getDocs() get the data just once
getDocs(shoesCollection).then((snapshot) => {
  //get the products data
  var shoes = snapshot.docs.map((doc) => doc.data());
  // do something with tha data
  //console.log(shoes);
});

function buy() {
  console.log(shoelist.length);
  var productsFirebase = [];
  for (let index = 0; index < shoelist.length; index++) {
    if (shoelist[index].cart) {
      var shoe = {
        name: shoelist[index].name,
        price: shoelist[index].price,
        quantity: shoelist[index].quantity,
        total: shoelist[index].total,
      };
      productsFirebase.push(shoe);
    }
  }
  firestore()
    .collection("cart")
    .add({
      total: total(),
      shoelist: productsFirebase,
    })
    .then(function (docRef) {
      console.log("Documento agregado con ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error al agregar el documento: ", error);
    });
  Swal.fire({
    type: "succes",
    title: "Right up!",
    text: "Order Completed",
  });
  clean();
}
function total() {
  let total = 0;
  for (let index = 0; index < shoelist.length; index++) {
    if (shoelist[index].cart) {
      total += shoelist[index].total;
    }
  }
  return total;
}

var con = 0;
var con2 = 0;

function clean() {
  for (let index = 0; index < shoelist.length; index++) {
    shoelist[index].cart = false;
    shoelist[index].quantity = 1;
    shoelist[index].total = 0;
    updateCart();
  }
}

$(document).ready(function () {
  $("#loginBtn").click(function () {
    $("#loginModal").css("opacity", "0");
    $("#loginModal").show();
    setTimeout(function () {
      $("#loginModal").css("opacity", "1");
    }, 10);
  });
  $(".modal-close").click(function () {
    $("#loginModal").css("opacity", "0");

    setTimeout(function () {
      $("#loginModal").hide();
    }, 300);
  });
});
