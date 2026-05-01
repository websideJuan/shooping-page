document.addEventListener("DOMContentLoaded", function () {
  const btnToggle = document.getElementById("btn-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const heroCarouselContainers = document.querySelectorAll(
    ".hero-carousel-container",
  );

  let currentContainer = 0;
  let cart = [];

  const toast = Toast();

  function showCurrentContainer() {
    heroCarouselContainers.forEach((heroContainer) =>
      heroContainer.classList.remove("active"),
    );

    if (heroCarouselContainers.length <= currentContainer) {
      currentContainer = 0;
    }

    heroCarouselContainers[currentContainer].classList.add("active");
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
      cartCollapse.classList.remove("show");
    } else {
      cartCollapse.classList.add("show");
    }
  }

  const renderProductItem = (filter = "men's clothing") => {
    const productContainer = document.querySelector("#container-product");
    productContainer.innerHTML = "";
    productsDatabase
      .filter((product) => product.category === filter)
      .forEach((cardProductItem) => {
        const cardProduct = document.createElement("div");
        cardProduct.classList.add("card-product");
        cardProduct.innerHTML = `
          <div class="card-img" >
            <img src="${cardProductItem.image}" />
          </div>
          <div class="card-body">
            <span style="color: lightgray">${cardProductItem.category}</span>
            <h4>${cardProductItem.title}</h4>
            
            <p class="card-price" style="color: rosybrown; font-weight: bold; font-size: 20px;">${cardProductItem.price}</p>
          </div>
          <div class="card-footer" >
            <button class="card-btn-add" data-id="${cardProductItem.id}">
              Añadir al carrito
            </button>
            <button style="border: none; border-radius: 999px">
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
      addToCart(e.target.dataset.id);
      console.log(cart.length);
      
      setTimeout(() => {
        btnToAdd.style.backgroundColor = "#333";
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

  const renderCartItem = (cart) => {
    const cartBody = document.querySelector("#cart-body");
    const totalProductsCart = document.querySelector("span#total");

    if (cart.length <= 0) {
      return (cartBody.innerHTML = `
      <div class="cart-body-empty ">
        <h5>
          El carrito esta vacio!
        </h5>
        <p>agrega productos para poder comprar</p>
        <button>Ir a comprar</button>
      </div>
      `);
    }

    const listCartProduct = document.createElement("ul");
    cartBody.innerHTML = "";
    cart.forEach((cartItem) => {
      listCartProduct.innerHTML += ` 
      <li class="cart-item" data-id=${cartItem.id}>
        <img
          src='${cartItem.image}'
          alt="${cartItem.title}"
        />
        <div class="cart-list-product">
          <h5>${cartItem.title}</h5>
          <p>${cartItem.price * cartItem.count}</p>

          <div class="cart-item-product">
            <button class="cart-btn-control" data-control="remove">
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
        </button>
      </li>`;
    });
    cartBody.appendChild(listCartProduct);

    cart.length <= 0
      ? (totalProductsCart.textContent = 0)
      : (totalProductsCart.textContent = [
          ...document.querySelectorAll(".cart-item p"),
        ].reduce((acc, current) => acc + Number(current.textContent), 0));

    actionCart(document.querySelectorAll(".cart-btn-control"));
    deleteCartItem(document.querySelectorAll(".cart-delete-item"));
    contatcForWstpp(cart);
  };

  const actionCart = (cartElements) => {
    cartElements.forEach((btnControl) => {
      if (btnControl) {
        btnControl.addEventListener("click", function (e) {
          if (btnControl.getAttribute("data-control") === "add") {
            const element = e.target.closest(".cart-item");
            const indexCartItem = cart.findIndex(
              (cartItem) => cartItem.id === element.dataset.id,
            );
            cart[indexCartItem].count++;
          } else {
            const element = e.target.closest(".cart-item");
            const indexCartItem = cart.findIndex(
              (cartItem) => cartItem.id === element.dataset.id,
            );
            cart[indexCartItem].count--;

            if (cart[indexCartItem].count <= 0) {
              cart.splice(indexCartItem, 1);
            }
          }

          renderCartItem(cart);
        });
      }
    });
  };

  const deleteCartItem = (cartDeleteItem) => {
    cartDeleteItem.forEach((btnDeleteCart) => {
      btnDeleteCart.addEventListener("click", function (e) {
        const liCartItem = e.target.closest(".cart-item");
        const indexCartItem = cart.findIndex(
          (cartItem) => cartItem.id === liCartItem.dataset.id,
        );
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
        const totalCartProduct = cart.reduce(
          (acc, current) => acc + Number(current.price) * current.count,
          0,
        );

        const totalCartProductIVA = totalCartProduct * 1.19;
        const formatCLP = (num) => num.toFixed(2);

        const telefono = "56929506564";
        const mensaje = `
        *Hola soy ${result.value} y estoy interesado en comprar!*

        ${productList.length < 2 ? "Producto" : "Productos"}:
        ${productList.join("\n")}

        *Total sin IVA: ${formatCLP(totalCartProduct)}*
        *Total: ${formatCLP(totalCartProductIVA)}*
        `;

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
      });
  };
});
