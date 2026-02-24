const tg = window.Telegram.WebApp;

const user = tg.initDataUnsafe.user;
const userId = user.id;

console.log("User ID:", userId);

document.querySelector("h1 div").textContent = String(window.location.search);
// console.log(window.location.search)

// const params = new URLSearchParams(window.location.search);
// const myToken = params.get("token");

// document.querySelector("h1 div").textContent = String(window.location.search);
// console.log(myToken);