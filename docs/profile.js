function renderProfile() {
  const user = localStorage.getItem("user");
  if (!user) {
    navigate(null, "auth");
    return;
  }
  
  //Загружаем данные пользователя с сервера
  fetch(`http://localhost:8080/api/auth/me?login=${user}`, {
    method: "GET",
    headers: {"Content-Type": "application/json"}
  })
    .then(r => r.json())
    .then(userData => {
      document.getElementById("profileLogin").innerText = userData.login || "-";
      document.getElementById("profileName").innerText = userData.name || "-";
      document.getElementById("profileKeyword").innerText = userData.keyWord || "-";

      const adminBtn = document.getElementById("adminPanelButton");

      if (userData.role === "ADMIN") {
        adminBtn.classList.remove("hidden");
      } else {
        adminBtn.classList.add("hidden");
      }
    })
    .catch(error => {
      console.error("Ошибка при загрузке профиля:", error);
      document.getElementById("profileLogin").innerText = user;
    });
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  updateAuthButton();
  navigate(null, "home");
}