document.addEventListener("DOMContentLoaded", function () {
  const btnToggle = document.getElementById("btn-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const heroCarouselContainers = document.querySelectorAll(
    ".hero-carousel-container",
  );
  const carouselDots = document.querySelectorAll('.dot')

  let currentContainer = 1;
  let cart = [];

  const toast = Toast();

  function showCurrentContainer() {
    heroCarouselContainers.forEach((heroContainer) =>
      heroContainer.classList.remove("active"),
    );

    carouselDots.forEach(dot => dot.classList.remove('active'))

    if (heroCarouselContainers.length <= currentContainer) {
      currentContainer = 0;
    }

    heroCarouselContainers[currentContainer].classList.add("active");
    carouselDots[currentContainer].classList.add('active')
    currentContainer++;
  }

  setInterval(() => {
    showCurrentContainer(currentContainer);
  }, 5000);

  // Events of navbar btns
  document.getElementById("btn-cart").addEventListener("click", function () {
    showCart();
  });

  document.getElementById("close-cart").addEventListener("click", function () {
    showCart();
  });

  btnToggle.addEventListener("click", function () {
    const isActive = navToggle.classList.toggle("show");
    if (isActive) {
      btnToggle.classList.add("toggle-active");
    } else {
      btnToggle.classList.remove("toggle-active");
    }
  });

  function showCart() {
    const cartCollapse = document.getElementById("cart-collapse");
    if (cartCollapse.classList.contains("show")) {
      cartCollapse.style.transitionDelay = ".6s";
      cartCollapse.children[0].style.transitionDelay = ".0s";
      cartCollapse.classList.remove("show");
    } else {
      cartCollapse.style.transitionDelay = ".0s";
      cartCollapse.children[0].style.transitionDelay = ".6s";
      cartCollapse.classList.add("show");
    }
  }

  const renderProductItem = (filter = "all") => {
    const productContainer = document.querySelector("#container-product");
    productContainer.innerHTML = "";
    productsDatabase
      .filter((product) =>
        filter === "all" ? product : product.category === filter,
      )
      .forEach((cardProductItem) => {
        const cardProduct = document.createElement("div");
        cardProduct.classList.add("card-product");
        cardProduct.innerHTML = `
          <div class="card-img" >
            <img src="${cardProductItem.image}" />
          </div>
          <div class="card-body">
            <span style="color: lightgray">${cardProductItem.category}</span>
            <h4>${cardProductItem.title.length > 10 ? cardProductItem.title.slice(0, 10).concat("...") : cardProductItem.title}</h4>
            <p class="card-price" style="color: rosybrown; font-size: 20px;">$ ${(cardProductItem.price - (cardProductItem.price * cardProductItem.discount) / 100).toLocaleString()}</p>
            ${
              cardProductItem.discount <= 0
                ? ""
                : `
                  <p style="position: absolute; top: 10px; left: 10px; background-color: red; color: white; padding: 3px 10px; font-weight: boldx">
                    ${`${cardProductItem.discount}%`}
                  </p>
                  <p class="card-price" style="text-align: end; text-decoration: line-through;">
                    ${cardProductItem.price.toLocaleString()}
                  </p>
                `
            }
          </div>
          <div class="card-footer" >
            <button class="card-btn-add" data-id="${cardProductItem.id}">
              Añadir
            </button>
            <button class="card-btn-like" >
              <span>
                <i class="fa-regular fa-heart"></i>
              </span>
            </button>
          </div>
        `;
        productContainer.appendChild(cardProduct);
      });
  };

  renderProductItem();

  document
    .querySelectorAll(".product-btn-category")
    .forEach((productBtnCategory) =>
      productBtnCategory.addEventListener("click", function () {
        const filter = productBtnCategory.dataset.filter;
        document
          .querySelectorAll(".product-btn-category")
          .forEach((b) => b.classList.remove("active"));
        productBtnCategory.classList.add("active");
        renderProductItem(filter);
      }),
    );

  document.querySelector(".product").addEventListener("click", function (e) {
    if (e.target.classList.contains("card-btn-add")) {
      const btnToAdd = e.target;
      btnToAdd.style.backgroundColor = "rosybrown";
      btnToAdd.style.color = "white";
      addToCart(e.target.dataset.id);
      console.log(cart.length);

      setTimeout(() => {
        btnToAdd.style.backgroundColor = "transparent";
        btnToAdd.style.color = "#333";
      }, 2000);
    }
  });

  const addToCart = (id) => {
    const indexProduct = cart.findIndex((product) => product.id === id);
    const product = productsDatabase.find((product) => product.id === id);

    if (indexProduct !== -1) {
      cart[indexProduct].count = cart[indexProduct].count + 1;
    } else {
      cart.push({
        ...product,
        count: 1,
      });
    }

    renderCartItem(cart);
    document.getElementById("btn-cart").classList.add("cart-index-item");
    document.getElementById("btn-cart").setAttribute("data-index", cart.length);
    toast.message(
      `${product.title} ${indexProduct !== -1 ? product.count : ""}`,
    );
  };

  const renderCartItem = (cartItems) => {
    const cartBody = document.querySelector("#cart-body");
    const totalProductsCart = document.querySelector("span#total");

    cartBody.innerHTML = "";

    if (cartItems.length === 0) {
      cartBody.innerHTML = `
      <div class="cart-body-empty ">
        <h5>
          El carrito esta vacio!
        </h5>
        <p>agrega productos para poder comprar</p>
        <button>Ir a comprar</button>
      </div>
      `;
    }

    const listCartItems = document.createElement("ul");

    cartItems.forEach((cartItem) => {
      const itemCartProduct = document.createElement("li");

      itemCartProduct.classList.add("cart-item");
      itemCartProduct.setAttribute("data-id", cartItem.id);
      itemCartProduct.innerHTML = `<img
          src="${cartItem.image}"
          alt="${cartItem.title}"
        />
        <div class="cart-list-product">
          <h5>${cartItem.title}</h5>
          <p>${cartItem.price.toLocaleString()}</p>

          <div class="cart-item-product">
            <button class="cart-btn-control ${cartItem.count === 1 ? "inactive" : ""}" data-control="remove">
              <span>
                <i class="fa-solid fa-minus"></i>
              </span>
            </button>
            <p>${cartItem.count}</p>
            <button class="cart-btn-control" data-control="add">
              <span>
                <i class="fa-solid fa-plus"></i>
              </span>
            </button>
          </div>
        </div>
        <button class="cart-delete-item" style="background-color: transparent; border: none; margin-left: auto; margin-top: auto;">
          <span>
            <i class="fa-solid fa-trash-can"></i>
          </span>
      </button>`;

      listCartItems.appendChild(itemCartProduct);
    });

    cartBody.appendChild(listCartItems);

    totalProductsCart.innerHTML = cartItems
      .reduce((acc, current) => acc + current.price * current.count, 0)
      .toLocaleString();

    actionCart(document.querySelectorAll(".cart-btn-control"));
    deleteCartItem(document.querySelectorAll(".cart-delete-item"));
    contatcForWstpp(cartItems);
  };

  const actionCart = (cartElements) => {
    cartElements.forEach((btnControl) => {
      const btnRemove = cartElements[0];
      btnControl.addEventListener("click", function (e) {
        const element = e.target.closest(".cart-item");
        const dataControl = btnControl.getAttribute("data-control");
        if (dataControl === "add") {
          const indexCartItem = cart.findIndex(
            (cartItem) => cartItem.id === element.dataset.id,
          );

          btnRemove.classList.remove("inactive");
          cart[indexCartItem].count++;
        }

        if (dataControl === "remove") {
          const indexCartItem = cart.findIndex(
            (cartItem) => cartItem.id === element.dataset.id,
          );

          if (cart[indexCartItem].count === 1) {
            return classList.add("inactive");
          }
          cart[indexCartItem].count--;
        }

        renderCartItem(cart);
      });
    });
  };

  const deleteCartItem = (cartDeleteItem) => {
    cartDeleteItem.forEach((btnDeleteCart) => {
      btnDeleteCart.addEventListener("click", function (e) {
        const liCartItem = e.target.closest(".cart-item");
        const indexCartItem = cart.indexOf(liCartItem.id);
        cart.splice(indexCartItem, 1);
        renderCartItem(cart);
      });
    });
  };

  const contatcForWstpp = (cart) => {
    document
      .querySelector("#finaly-shopping")
      .addEventListener("click", async function () {
        if (cart.length === 0) return toast.message("cart empty");

        const result = await toast.confirm("Excelente!, Cual es tu nombre?");

        if (!result.confirm) return;

        const productList = cart.map((product) => `- ${product.title}`);
        const subTotal = cart.reduce(
          (acc, current) => acc + Number(current.price) * current.count,
          0,
        );

        const total = subTotal * 1.19;
        // const formatCLP = (num) => num.toFixed(6);

        const telefono = "56929506564";
        const mensaje = `
        *Hola soy ${result.value} y estoy interesado en comprar!*

        ${productList.length < 2 ? "Producto" : "Productos"}:
        ${productList.join("\n")}

        *Total sin IVA: ${subTotal}*
        *Total: ${total}*
        `;

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
      });
  };
});
