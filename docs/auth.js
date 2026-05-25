function calculatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return { level: 'weak', text: 'Слабый' };
  if (strength <= 3) return { level: 'fair', text: 'Нормальный' };
  if (strength <= 4) return { level: 'good', text: 'Хороший' };
  return { level: 'strong', text: 'Очень мощный' };
}

function updatePasswordStrength() {
  const password = document.getElementById("regPassword").value;
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  
  if (!password) {
    strengthBar.className = 'strength-bar';
    strengthText.innerText = '';
    return;
  }
  

  const { level, text } = calculatePasswordStrength(password);
  strengthBar.className = 'strength-bar ' + level;
  strengthText.innerText = text;
}

function updateForgotPasswordStrength() {
  const password = document.getElementById("forgotPassword").value;
  const strengthBar = document.getElementById("forgotStrengthBar");
  const strengthText = document.getElementById("forgotStrengthText");
  
  if (!password) {
    strengthBar.className = 'strength-bar';
    strengthText.innerText = '';
    return;
  }
  
  const { level, text } = calculatePasswordStrength(password);
  strengthBar.className = 'strength-bar ' + level;
  strengthText.innerText = text;
}

function isStrongPassword(password) {
  return password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
}

function register() {
  const error = document.getElementById("registerError");

  const login = document.getElementById("regLogin").value.trim();
  const name = document.getElementById("regName").value.trim();
  const keyWord = document.getElementById("regKey").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regPasswordConfirm").value;

  error.style.color = "#ef4444";
  error.innerText = "";

  if (!password) {
    error.innerText = "Пароль не может быть пустым";
    return;
  }

  if (password !== confirmPassword) {
    error.innerText = "Пароли не совпадают";
    return;
  }

  fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      login,
      name,
      keyWord,
      passwordHash: password
    })
  })
    .then(r => r.text())
    .then(res => {
      if (res === "REGISTERED") {
        localStorage.setItem("user", login);
        updateAuthButton();
        navigate(null, "profile");
        renderProfile();
      } else if (res === "LOGIN_TAKEN") {
        error.innerText = "Логин уже занят";
      } else if (res === "LOGIN_TOO_SHORT") {
        error.innerText = "Логин слишком короткий";
      } else if (res === "KEYWORD_REQUIRED") {
        error.innerText = "Введите ключевое слово";
      } else if (res === "QUESTION_REQUIRED") {
        error.innerText = "Введите секретный вопрос";
      } else {
        error.innerText = res;
      }

      document.getElementById("regLogin").value = "";
      document.getElementById("regName").value = "";
      document.getElementById("regKey").value = "";
      document.getElementById("regPassword").value = "";
      document.getElementById("regPasswordConfirm").value = "";
    });
}

function login() {
  const login = document.getElementById("loginInput").value.trim();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");

  error.style.color = "#ef4444";
  error.innerText = "";

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      login,
      passwordHash: password
    })
  })
    .then(r => r.text())
    .then(res => {
    if (res === "ADMIN" || res === "USER") {
      localStorage.setItem("user", login);
      localStorage.setItem("role", res);
      updateAuthButton();
      navigate(null, "profile");
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

  const login = document.getElementById("forgotLogin").value.trim();
  const keyWord = document.getElementById("forgotKey").value.trim();
  const password = document.getElementById("forgotPassword").value;
  const confirmPassword = document.getElementById("forgotConfirmPassword").value;

  error.style.color = "#ef4444";
  error.innerText = "";

  if (!password) {
    error.innerText = "Пароль не может быть пустым";
    return;
  }

  if (password !== confirmPassword) {
    error.innerText = "Пароли не совпадают";
    return;
  }

  fetch(`${API_URL}/forgot`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      login,
      keyWord,
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
      } else {
        error.innerText = res;
      }

      document.getElementById("forgotLogin").value = "";
      document.getElementById("forgotKey").value = "";
      document.getElementById("forgotPassword").value = "";
      document.getElementById("forgotConfirmPassword").value = "";
    });
}

function backToLogin() {
  document.getElementById("forgotForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function switchTab(tab, event) {
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
  document.getElementById("forgotForm").classList.add("hidden");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  event.target.classList.add("active");
}