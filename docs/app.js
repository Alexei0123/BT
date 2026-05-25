const API_URL = "https://anistreet.onrender.com/api/auth";

let cartState = [];
let favoritesState = [];

const pageMap = {
  'home': '/',
  'catalog': '/catalog',
  'auth': '/auth',
  'profile': '/profile',
  'admin': '/admin',
  'product': '/product',
  'cart': '/cart',
  'favorites': '/favorites',
  'notfound': '/404',
  'servererror': '/500'
};

let catalogInitialized = false;

function navigate(event, page) {
  if (event) {
    event.preventDefault();
  }
  window.history.pushState(null, null, pageMap[page] || '/' + page);
  renderPage();
}

function goTo(page) {
  window.history.pushState(null, null, pageMap[page] || '/' + page);
  renderPage();
}

function renderPage() {
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("active"));

  const pathname = window.location.pathname;

  const pageMap = {
  "/": "home",
  "/catalog": "catalog",
  "/auth": "auth",
  "/profile": "profile",
  "/admin": "admin",
  "/product": "product",
  "/cart": "cart",
  "/favorites": "favorites",
  "/404": "notfound",
  "/500": "servererror"
  };

  const pageId = pageMap[pathname] || "notfound";

  console.log("PATH:", pathname);
  console.log("PAGE:", pageId);

  //Проверка авторизации
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  //Если не авторизован то нельзя в профиль
  if (pageId === "profile" && !user) {
    navigate(null, "auth");
    return;
  }

  //Если не админ то нельзя в админку
  if (pageId === "admin") {
    if (!user || role !== "ADMIN") {
      navigate(null, "home");
      return;
    }
  }

  const activePage = document.getElementById(pageId);

  if (activePage) {
    activePage.classList.add("active");
  }

  if (pageId === "profile") {
    renderProfile();
  }

  if (pageId === "catalog") {
    refreshPage();
    if (!catalogInitialized) {
    setupCatalogSearch();
    setupCategoryFilter();
    setupSorting();
    catalogInitialized = true;
    }
  }

  if (pageId === "product") {
    activePage.classList.add("active");
    refreshPage();
  }

  if (pageId === "cart") {
    if (!user) {
      navigate(null, "auth");
      return;
    }
    refreshPage();
  }

  if (pageId === "favorites") {
    if (!user) {
      navigate(null, "auth");
      return;
    }
    refreshPage();
  }

  if(pageId === "home"){
    refreshPage();
  }

  if (pageId === "auth" ) {
    if (user) { 
      navigate(null, "profile");
      return;
    }
    
    document.getElementById("forgotForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
  }

  console.log("ACTIVE PAGE ELEMENT:", activePage);
  console.log("ACTIVE CLASS:", activePage?.classList);

  console.log("Current page:", pageId);
}

function updateAuthButton() {
  const authBtn = document.getElementById("authBtn");
  const user = localStorage.getItem("user");

  if (user) {
    authBtn.innerText = "Профиль";
    authBtn.style.background = "#6366f1";	
  } else {
    authBtn.innerText = "Войти";
    authBtn.style.background = "#008080";
  }
}

function handleAuthClick(event) {
  event.preventDefault();

  const user = localStorage.getItem("user");

  if (user) {
    navigate(event, "profile");
  } else {
    navigate(event, "auth");
  }
}

async function refreshPage() {
  await loadCartState();
  await loadFavoritesState();

  const page = window.location.pathname;

  if (page.includes("cart")) {
    await renderCart();
  } else if (page.includes("favorites")) {
    await renderFavorites();
  } else if (page.includes("product")) {
    renderProduct();
  } else if (page === "/") {
    await renderNewProducts();
  } else {
    renderCatalog();
  }
}

async function init() {
  await refreshPage();
  renderPage();
  updateAuthButton();
}
window.addEventListener("load", init);
window.addEventListener("popstate", renderPage);
