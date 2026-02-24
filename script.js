// const tg = window.Telegram.WebApp;

// const user = tg.initDataUnsafe.user;
// const userId = user.id;

// console.log("User ID:", userId);

params = window.location.search
if (window.location.search == "") {
  params = "Неизвестно"
}
document.querySelector("h1 div").textContent = params;
// console.log(window.location.search)

// const params = new URLSearchParams(window.location.search);
// const myToken = params.get("token");

// document.querySelector("h1 div").textContent = String(window.location.search);
// console.log(myToken);