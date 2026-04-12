function register() {
  const error = document.getElementById("registerError");

  const login = document.getElementById("regLogin").value;
  const name = document.getElementById("regName").value;
  const keyWord = document.getElementById("regKey").value;
  const password = document.getElementById("regPassword").value;

  error.innerText = "";

  fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      login: login,
      name: name,
      keyWord: keyWord,
      passwordHash: password
    })
  })
  .then(r => r.text())
  .then(res => {

    if (res === "REGISTERED") {
      localStorage.setItem("user", login);
      goTo("profile");
      renderProfile();
    } else if (res === "LOGIN_TAKEN") {
      error.innerText = "Логин уже занят";
    } else if (res === "LOGIN_TOO_SHORT") {
      error.innerText = "Логин слишком короткий";
    } else if (res === "KEYWORD_REQUIRED") {
      error.innerText = "Введите ключевое слово";
    } else {
      error.innerText = res;
    }

    document.getElementById("regLogin").value = "";
    document.getElementById("regName").value = "";
    document.getElementById("regKey").value = "";
    document.getElementById("regPassword").value = "";
  });
}

function login() {
  const login = document.getElementById("loginInput").value;
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  error.innerText = ""; //Очистить

  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      login: login,
      passwordHash: password
    })
  })
  .then(r => r.text())
  .then(res => {
    if (res === "OK") {
      localStorage.setItem("user", login);
      goTo("profile");
      renderProfile();
    } else {
      error.innerText = "Неверный логин или пароль";
    }

    document.getElementById("loginInput").value = "";
    document.getElementById("loginPassword").value = "";
  });
}

function showForgot() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("forgotForm").classList.remove("hidden");

  
  document.getElementById("registerForm").classList.add("hidden");
}

function forgot() {
  const error = document.getElementById("forgotError");

  const login = document.getElementById("forgotLogin").value;
  const keyWord = document.getElementById("forgotKey").value;
  const password = document.getElementById("forgotPassword").value;

  error.innerText = "";

  fetch("http://localhost:8080/api/auth/forgot", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      login: login,
      keyWord: keyWord,
      passwordHash: password
    })
  })
  .then(r => r.text())
  .then(res => {

    if (res === "PASSWORD_CHANGED") {
      error.style.color = "green";
      error.innerText = "Пароль изменён!";
    } else if (res === "NOT_FOUND") {
      error.innerText = "Пользователь не найден";
    } else if (res === "WRONG_KEYWORD") {
      error.innerText = "Неверное ключевое слово";
    }

    document.getElementById("forgotLogin").value = "";
    document.getElementById("forgotKey").value = "";
    document.getElementById("forgotPassword").value = "";
  });
}

function backToLogin() {
  document.getElementById("forgotForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function goTo(page) {
  window.location.hash = page;
}

function switchTab(tab, event) {

  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");

  document.getElementById("forgotForm").classList.add("hidden");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  event.target.classList.add("active");
}

function renderPage() {
  const pages = document.querySelectorAll(".page");

  pages.forEach(p => {
    p.classList.remove("active");
  });

  let hash = window.location.hash.replace("#", "");

  if (!hash) hash = "home";

  const activePage = document.getElementById(hash);

  if (activePage) {
    activePage.classList.add("active");
  }

  if (hash === "profile") {
    renderProfile();
  }

  if (hash === "auth") {

    document.getElementById("forgotForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");

  }
  console.log("Current page:", hash);
}

function renderProfile() {
  const user = localStorage.getItem("user");

  if (user) {
    document.getElementById("welcomeText").innerText =
      "Добро пожаловать, " + user;
  }
}

function logout() {
  localStorage.removeItem("user");
  goTo("home");
}

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", () => {
  console.log("JS loaded OK");
  renderPage();

  document.getElementById("forgotForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
});