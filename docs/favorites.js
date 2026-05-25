function isFavorite(productId) {
  return favoritesState.some(item => item.productId === productId);
}

async function toggleFavorite(productId) {

  const login = localStorage.getItem("user");
  if (!login) {
    navigate(null, "auth");
    return;
  }
  
  await fetch(
    "http://localhost:8080/api/favorites/toggle",
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

function renderFavoriteButton(product) {
  
  const favorite = isFavorite(product.id);

  return `
    <button
      class="favorite-btn ${favorite ? 'active' : ''}"
      onclick="event.stopPropagation(); toggleFavorite(${product.id})"
    >
      ${favorite ? '❤' : '♡'}
    </button>
  `;
}

async function renderFavorites() {
  const container = document.getElementById("favoritesItems");

  if (!container) return;

  if (favoritesState.length === 0) {
    container.innerHTML = "<p>Избранное пусто</p>";
    return;
  }

  //Загружаем полные товары
  const fullFavorites = await Promise.all(

    favoritesState.map(async item => {

      return await loadProductById(
        item.productId
      );
    })
  );

  container.innerHTML = `
    <div class="grid">

      ${fullFavorites.map(product => `

        <div
          class="card product-card"
          onclick="openProduct(${product.id})"
        >

          ${renderFavoriteButton(product)}

          <div class="product-image">
            <img src="http://localhost:8080${product.imageUrl}">
          </div>

          <h3 class="product-title">
            ${product.name}
          </h3>

          <p class="price">
            <strong>${product.price} BYN</strong>
          </p>

          ${renderCartButton(product)}

        </div>

      `).join("")}

    </div>
  `;
}

async function loadFavoritesState() {
  const login = localStorage.getItem("user");
  const response = await fetch( `http://localhost:8080/api/favorites/${login}` );
  favoritesState = await response.json();
}