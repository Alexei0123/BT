//Функция для загрузки товаров с сервера
async function loadProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products");
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
    window.history.pushState(null,null,"/500");
    renderPage();
  }
  return [];
}

//Функция для загрузки товара по ID
async function loadProductById(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Ошибка при загрузке товара:", error);
    window.history.pushState(null,null,"/500");
    renderPage();
  }
  return null;
}

//Функция для поиска товаров
async function searchProducts(query) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/search?name=${encodeURIComponent(query)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Ошибка при поиске товаров:", error);
    window.history.pushState(null,null,"/500");
    renderPage();
  }
  return [];
}

//Функция для получения товаров по категории
async function getProductsByCategory(category) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/category/${category}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Ошибка при загрузке товаров по категории:", error);
    window.history.pushState(null,null,"/500");
    renderPage();
  }
  return [];
}

async function renderProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = await loadProductById(id);

  if (!product) {
    window.history.pushState(null,null,"/404");
    renderPage();
    return;
  }

  document.getElementById("productPageName").textContent = product.name;
  document.getElementById("productPagePrice").textContent = product.price + " BYN";
  document.getElementById("productPageDescription").textContent = product.description;
  document.getElementById("productPageImage").src = "http://localhost:8080" + product.imageUrl;
  document.getElementById("productCartControls").innerHTML = renderCartButton(product);

  const favoriteBtn = document.getElementById("productFavoriteBtn");

  favoriteBtn.innerHTML = isFavorite(product.id) ? "❤" : "♡";
  favoriteBtn.classList.toggle( "active", isFavorite(product.id));
  favoriteBtn.onclick = async (event) => { event.stopPropagation(); await toggleFavorite(product.id); refreshPage(); };
}

function openProduct(id) {
  window.history.pushState(null, null, "/product?id=" + id);
  setTimeout(renderPage, 0);
}

async function loadNewProducts() {
  try {
    const response = await fetch( "http://localhost:8080/api/products/new");

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error( "Ошибка загрузки новинок:", error );
  }
  return [];
}

async function renderNewProducts() {
  const products = await loadNewProducts();
  const grid = document.getElementById( "newProductsGrid" );

  if (!products.length) {
    grid.innerHTML = "<p>Новинок пока нет</p>";
    return;
  }

  grid.innerHTML = products.map(product => `

    <div
      class="card product-card"
      onclick="openProduct(${product.id})"
    >

      ${renderFavoriteButton(product)}

      <div class="product-image">

        <img
          src="http://localhost:8080${product.imageUrl}"
        >

      </div>

      <h3 class="product-title">
        ${product.name}
      </h3>

      <p class="price">

        <strong>
          ${product.price} BYN
        </strong>

      </p>

      ${renderCartButton(product)}

    </div>

  `).join("");
}