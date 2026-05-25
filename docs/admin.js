let editingProductId = null;

async function addProduct() {
  const name = document.getElementById("productName").value;
  const description = document.getElementById("productDescription").value;
  const price = document.getElementById("productPrice").value;
  const category = document.getElementById("productCategory").value;
  const image = document.getElementById("productImage").files[0];

  const formData = new FormData();
  
  const message = document.getElementById("adminMessage");

  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  if (image) {
    formData.append("image", image);
  }
  try {
    const response = await fetch(
      "http://localhost:8080/api/products",
      {
        method: "POST",

        body: formData
      }
    );

    if (response.ok) {
      showToast("Товар успешно добавлен");
      document.getElementById("productName").value = "";
      document.getElementById("productDescription").value = "";
      document.getElementById("productPrice").value = "";
      document.getElementById("productImage").value = "";

      await refreshPage();
    } else {
      showToast("Ошибка при добавлении",true);
    }
  } catch (error) {
    showToast("Ошибка сервера",true);
  }
}

function showAdminSection(sectionId, button) {
  document.querySelectorAll(".admin-section").forEach(section => {section.classList.add("hidden");});
  document.getElementById(sectionId).classList.remove("hidden");
  document.querySelectorAll(".admin-tab").forEach(tab => {tab.classList.remove("active");});
  button.classList.add("active");

  if (sectionId === "editProductSection") {
    renderAdminProducts();
  }
  if (sectionId === "usersSection") {
    document.getElementById("usersSection").classList.remove("hidden");
    loadUsers();

  }
}

async function renderAdminProducts() {
  const products = await loadProducts();
  const container = document.getElementById("adminProductsList");

  container.innerHTML = products.map(product => `

    <div class="admin-product-card">

      <div class="admin-product-info">

        <img
          src="http://localhost:8080${product.imageUrl}"
          class="admin-product-image"
        >

        <div>

          <h3>${product.name}</h3>

          <p>${product.price} BYN</p>

        </div>

      </div>

      <div class="admin-product-actions">

        <button
          class="btn-primary"
          onclick='openEditModal(${JSON.stringify(product)})'
        >
          Редактировать
        </button>

        <button
          class="btn-primary logout-btn"
          onclick="deleteProduct(${product.id})"
        >
          Удалить
        </button>

      </div>

    </div>

  `).join("");
}

function openEditModal(product) {
  editingProductId = product.id;

  document.getElementById("modalProductName").value = product.name;
  document.getElementById("modalProductDescription").value = product.description;
  document.getElementById("modalProductPrice").value = product.price;
  document.getElementById("modalProductCategory").value = product.category;
  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

async function saveProductChanges() {
  const image = document.getElementById("modalProductImage").files[0];
  const formData = new FormData();

  formData.append("name",document.getElementById("modalProductName").value);
  formData.append("description",document.getElementById("modalProductDescription").value);
  formData.append("price",document.getElementById("modalProductPrice").value);
  formData.append("category",document.getElementById("modalProductCategory").value);

  if (image) {
    formData.append("image", image);
  }

  const response = await fetch(
    `http://localhost:8080/api/products/${editingProductId}`,
    {
      method: "PUT",

      body: formData
    }
  );

  if (response.ok) {
    closeEditModal();
    showToast("Товар обновлён");
    await renderAdminProducts();
    refreshPage();
  } else {
    showToast("Ошибка обновления", true);
  }
}

async function deleteProduct(id) {

  const confirmed = await customConfirm("Удалить товар?");
  if (!confirmed) {
    return;
  }

  const response = await fetch(
    `http://localhost:8080/api/products/${id}`,
    {
      method: "DELETE"
    }
  );

  if (response.ok) {
    showToast("Товар удалён");
    renderAdminProducts();
    refreshPage();
  } else {
    showToast("Ошибка удаления", true);
  }
}

function showToast(message, isError = false) {
  const toast =document.getElementById("toast");

  toast.textContent = message;
  toast.style.background =isError ? "#d9534f" : "#222";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


function customConfirm(text) {

  return new Promise((resolve) => {

    const modal = document.getElementById("confirmModal");
    const confirmText = document.getElementById("confirmText");
    const yesBtn = document.getElementById("confirmYes");
    const noBtn = document.getElementById("confirmNo");

    confirmText.textContent = text;

    modal.classList.remove("hidden");

    yesBtn.onclick = () => {
      modal.classList.add("hidden");
      resolve(true);
    };

    noBtn.onclick = () => {
      modal.classList.add("hidden");
      resolve(false);
    };

  });
}

async function loadUsers() {

  const response = await fetch(
    "http://localhost:8080/api/users"
  );

  const users = await response.json();
  const currentUser = localStorage.getItem("user");

  const container = document.getElementById("usersList");

  container.innerHTML = users.map(user => `

    <div class="user-card">

      <input
        value="${user.login}"
        disabled
        class="user-login-input"
      >

      <input
        id="user-name-${user.id}"
        value="${user.name}"
      >

      <select id="user-role-${user.id}">

        <option
          value="USER"
          ${user.role === "USER"
            ? "selected"
            : ""}
        >
          USER
        </option>

        <option
          value="ADMIN"
          ${user.role === "ADMIN"
            ? "selected"
            : ""}
        >
          ADMIN
        </option>

      </select>

      ${
      user.login === currentUser
      ? `
        <button
        class="btn-primary"
        disabled
        >
        Свой аккаунт
        </button>
      `
     : `
        <button
        class="btn-primary"
        onclick="updateUser(${user.id})"
        >
        Сохранить
        </button>
      `
      }

    ${
      user.login === currentUser
      ? ""
      : `
        <button
        class="btn-primary logout-btn"
        onclick="deleteUser(${user.id})"
        >
        Удалить
      </button>
      `
    }

    </div>

  `).join("");
}


async function updateUser(id) {
  const name = document.getElementById(`user-name-${id}`).value;
  const role = document.getElementById(`user-role-${id}`).value;

  const response = await fetch(
    `http://localhost:8080/api/users/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name,
        role
      })
    }
  );

  if (response.ok) {
    showToast("Пользователь обновлен");
    loadUsers();
  } else {
    showToast("Ошибка при обновлении", true);
  }
}

async function deleteUser(id) {
  const confirmed = await customConfirm("Удалить пользователя?");
  if (!confirmed) {
    return;
  }

  const response = await fetch(
    `http://localhost:8080/api/users/${id}`,
    {
      method: "DELETE"
    }
  );

  if (response.ok) {
    showToast("Пользователь удален");
    loadUsers();

  } else {

    const text = await response.text();

    showToast(text, true);
  }
}