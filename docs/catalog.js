let currentCatalogProducts = [];

//Меньше 7 не ставить 
let visibleProducts = 12;
const productsStep = 12;
let isLoadingProducts = false;

async function renderCatalog(products = null) {

  const grid = document.getElementById("productsGrid");

  if (!products) {
    products = await loadProducts();
  }

  currentCatalogProducts = products;

  if (!products || products.length === 0) {
    grid.innerHTML = "<p>Товары не найдены</p>";
    return;
  }

  const visible = products.slice(0, visibleProducts);

  grid.innerHTML = visible.map(product => `

    <div 
      class="card product-card"
      onclick="openProduct(${product.id})"
    >

      ${renderFavoriteButton(product)}

      <div class="product-image">

        <img src="${
          product.imageUrl
          ? 'http://localhost:8080' + product.imageUrl
          : 'https://via.placeholder.com/200'
        }">

      </div>

      <h3 class="product-title">
        ${product.name}
      </h3>

      <p class="price">
        <strong>
          ${Number(product.price).toFixed(2)} BYN
        </strong>
      </p>

      ${renderCartButton(product)}

    </div>

  `).join("");
}

function loadMoreProducts() {
  if (visibleProducts >= currentCatalogProducts.length) return;

  isLoadingProducts = true;

  visibleProducts += productsStep;

  renderCatalog(currentCatalogProducts);

  isLoadingProducts = false;
}

async function setupCatalogSearch() {

  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", async (e) => {

    const query = e.target.value.trim();

    if (!query) {
      renderCatalog();
      return;
    }

    const results = await searchProducts(query);
    visibleProducts = 12;
    renderCatalog(results);
  });
}

async function setupCategoryFilter() {

  const categoryFilter = document.getElementById("categoryFilter");

  categoryFilter.addEventListener("change", async (e) => {

    const category = e.target.value;

    if (!category) {
      renderCatalog();
      return;
    }

    const results = await getProductsByCategory(category);
    visibleProducts = 12;
    renderCatalog(results);
  });
}

function setupSorting() {

  const sortSelect = document.getElementById("sortSelect");

  sortSelect.addEventListener("change", async (e) => {

    let products = await loadProducts();

    switch (e.target.value) {

      case "priceAsc":
        products.sort((a, b) => a.price - b.price);
        break;

      case "priceDesc":
        products.sort((a, b) => b.price - a.price);
        break;

      case "nameAsc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    renderCatalog(products);
  });
}

window.addEventListener("scroll", () => {
  if (isLoadingProducts) return;
  const scrollTop =window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.offsetHeight;

  if (scrollTop + windowHeight >= documentHeight - 300) loadMoreProducts();
});
