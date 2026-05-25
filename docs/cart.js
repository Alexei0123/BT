async function addToCartById(productId) {

  console.log(productId);

  const login = localStorage.getItem("user");
  if (!login) {
    navigate(null, "auth");
    return;
  }

  const response = await fetch(
    "http://localhost:8080/api/cart/add",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        login,
        productId
      })
    }
  );

  console.log(response.status);

  await refreshPage();
}

async function changeQuantity(productId, delta) {

  const login = localStorage.getItem("user");

  const endpoint =
    delta > 0
      ? "/api/cart/increase"
      : "/api/cart/decrease";

  await fetch(
    `http://localhost:8080${endpoint}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        login,
        productId
      })
    }
  );

  await refreshPage();
}

async function removeFromCart(productId) {

  const login = localStorage.getItem("user");

  await fetch(
    "http://localhost:8080/api/cart/remove",
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        login,
        productId
      })
    }
  );

  await refreshPage();
}

async function renderCart() {

  const login = localStorage.getItem("user");
  const response = await fetch( `http://localhost:8080/api/cart/${login}` );
  const cart = await response.json();
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (cart.length === 0) {
    container.innerHTML = "<p>Корзина пуста</p>";
    totalEl.innerHTML = "";
    return;
  }

  let total = 0;

  //Загружаем полные товары
  const fullCart = await Promise.all(

    cart.map(async item => {

      const product =
        await loadProductById(item.productId);

      return {
        ...product,
        quantity: item.quantity
      };
    })
  );

  container.innerHTML = `
    <div class="grid">
      ${fullCart.map(item => {
        total += item.price * item.quantity;
        return `
          <div class="card product-card" onclick="openProduct(${item.id})">

            <div class="product-image">
              <img src="http://localhost:8080${item.imageUrl}">
            </div>

            <h3 class="product-title">
              ${item.name}
            </h3>

            <p class="price">
              <strong>${item.price} BYN</strong>
            </p>

            <div class="quantity-controls">

              <button
                class="qty-btn"
                onclick="changeQuantity(${item.id}, -1)"
              >
                −
              </button>

              <span class="qty-count">
                ${item.quantity}
              </span>

              <button
                class="qty-btn"
                onclick="changeQuantity(${item.id}, 1)"
              >
                +
              </button>

            </div>

            <p style="text-align:center; font-weight:bold;">
              ${(item.price * item.quantity).toFixed(2)} BYN
            </p>

          </div>

        `;
      }).join("")}

    </div>
  `;

  totalEl.innerHTML = ` Итого: ${total.toFixed(2)} BYN`;
}

async function loadCartState() {
  const login = localStorage.getItem("user");
  const response = await fetch( `http://localhost:8080/api/cart/${login}` );
  cartState = await response.json();
}

function renderCartButton(product) {
  const existing =
    cartState.find(item =>
      item.productId === product.id
    );

  if (!existing) {

    return `
      <button
        class="btn-primary"
        onclick="event.stopPropagation();
        addToCartById(${product.id})"
      >
        В корзину
      </button>
    `;
  }

  return `
    <div
      class="quantity-controls"
      onclick="event.stopPropagation()"
    >

      <button
        class="qty-btn"
        onclick="changeQuantity(${product.id}, -1)"
      >
        −
      </button>

      <span class="qty-count">
        ${existing.quantity}
      </span>

      <button
        class="qty-btn"
        onclick="changeQuantity(${product.id}, 1)"
      >
        +
      </button>

    </div>
  `;
}