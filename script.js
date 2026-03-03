const tg = window.Telegram.WebApp;
const reasonsList = [
  "Названия не соответствуют",
  "Штрихкод не соответствует",
  "Картинка не соответствует",
];
const statuses_sbor_dict = {
  "READY": "✅",
  "TO_REPAIRS": "🔨",
  "CANCEL": "❌",
  "": "?",
}
tg.expand();
tg.ready();

const params = new URLSearchParams(window.location.search);
const user_token = params.get("user_token");
const order_id = params.get("order_id");
// localStorage.clear()

let datetime = new Date();
let datetime_today = new Date(
  datetime.getFullYear(),
  datetime.getMonth(),
  datetime.getDate()
);
const CACHE_KEY = 'product_cache_v2';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

let productCache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};

// Очистка устаревших записей (можно вызывать при старте)
function cleanCache() {
  const now = Date.now();
  let changed = false;
  for (const [id, entry] of Object.entries(productCache)) {
    if (now - entry.timestamp > CACHE_TTL) {
      delete productCache[id];
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(productCache));
  }
}
cleanCache();

let orders_info = JSON.parse(localStorage.getItem('orders_in_sborke')) || {};
for (let id in orders_info) {
  let order_datetime = new Date(orders_info[id]["datetime"]);
  if (datetime_today > order_datetime) {
    delete orders_info[id];
    console.log(`Удалил ${id}`);
  }
}
if (!(order_id in orders_info)) {
  console.log(`Создал новый ${order_id}`);
  orders_info[order_id] = {
    "products": {},
    "datetime": datetime_today.toISOString(),
    "phone_number": "",
    "start_work_datetime": null,
  };
}

localStorage.setItem('orders_in_sborke', JSON.stringify(JSON.parse(JSON.stringify(orders_info))));
console.log(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(orders_info)))))


card_html = `
    <div class="card">
      <img data-nuxt-pic="" src="https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1013324.webp" srcset="https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1013324.webp 256w, https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1013324.webp 512w">
      <div class="title">
        {{name}}
      </div>

      <div class="row">
        <span class="label">Кол:</span>
        <span class="value">{{count}}</span>
      </div>

      <div class="row">
        <span class="label">ШК:</span>
        <span class="value">{{shtrih}}</span>
      </div>

      <div class="actions">
        <button class="btn success">✅</button>
        <button class="btn edit">🔨</button>
        <button class="btn danger">❌</button>
      </div>
    </div>
`
products = {}

// Для оффлайн тестов
// products_array = [
//     [
//         "УТ-00004304",
//         {
//             "status": "",
//             "name": "Мороженое Коровка из Кореновки шоколадный пломбир 100г",
//             "article": "УТ-00004304",
//             "category_id": 122,
//             "order": 565,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/УТ-00004304.webp",
//             "count": 1,
//             "price": 103,
//             "total_price": 103,
//             "barcode": "4602358003670",
//             "teh_name": "Мороженое Ваф.ст. Пломбир шок. 100г КК",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "УТ-00004797",
//         {
//             "status": "",
//             "name": "Мороженое пломбир Коровка из Кореновки с шоколадной крошкой 80г",
//             "article": "УТ-00004797",
//             "category_id": 122,
//             "order": 647,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/УТ-00004797.webp",
//             "count": 1,
//             "price": 115,
//             "total_price": 115,
//             "barcode": "4602358007128",
//             "teh_name": "Мороженое Ваф. пломбир с шок крошкой 80г",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "ЦР-00004354",
//         {
//             "status": "",
//             "name": "Мороженое Сакское Мороженое Пломбир ванильный 80г",
//             "article": "ЦР-00004354",
//             "category_id": 122,
//             "order": 1038,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-00004354.webp",
//             "count": 1,
//             "price": 96,
//             "total_price": 96,
//             "barcode": "4665296320018",
//             "teh_name": "Мороженое Пломбир ванил. в ваф.ст 80г",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "7M-00000541",
//         {
//             "status": "",
//             "name": "Мороженое Фабрика Мороженого крем-брюле 90г",
//             "article": "7M-00000541",
//             "category_id": 122,
//             "order": 1311,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/7M-00000541.webp",
//             "count": 1,
//             "price": 138,
//             "total_price": 138,
//             "barcode": "4602358009696",
//             "teh_name": "Мороженое Лакомка Крем-брюле 90г КК",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "ЦР-1005067",
//         {
//             "status": "",
//             "name": "Форель Русское море филе-кусок слабосоленая 200г",
//             "article": "ЦР-1005067",
//             "category_id": 115,
//             "order": 2501,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1005067.webp",
//             "count": 1,
//             "price": 794,
//             "total_price": 794,
//             "barcode": "4605561008296",
//             "teh_name": "Только 2м Форель с/с филе 200г",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "2Р-00000143",
//         {
//             "status": "",
//             "name": "Сосиски Папа может Сочные 350г",
//             "article": "2Р-00000143",
//             "category_id": 113,
//             "order": 610,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/2Р-00000143.webp",
//             "count": 1,
//             "price": 193,
//             "total_price": 193,
//             "barcode": "4607958076024",
//             "teh_name": "Сосиски Сочные 410г ТМ Папа Может",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "УТ-00003304",
//         {
//             "status": "",
//             "name": "Молоко Простоквашино пастеризованное 2.5% 930мл",
//             "article": "УТ-00003304",
//             "category_id": 101,
//             "order": 521,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/УТ-00003304.webp",
//             "count": 3,
//             "price": 138,
//             "total_price": 414,
//             "barcode": "4607053473544",
//             "teh_name": "Молоко у/паст. 2.5% 930мл TП Простоквашино",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "ЦР-1008946",
//         {
//             "status": "",
//             "name": "Готовый завтрак Хрутка шоколадный обогащенный кальцием 460г",
//             "article": "ЦР-1008946",
//             "category_id": 97,
//             "order": 500,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1008946.webp",
//             "count": 2,
//             "price": 133,
//             "total_price": 266,
//             "barcode": "4600680025551",
//             "teh_name": "Готовый завтрак 230г Шарики шоколад ТМ Хрутка",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "ЦР-1008022",
//         {
//             "status": "",
//             "name": "Готовый завтрак Леонардо Шарики с шоколадом 200г",
//             "article": "ЦР-1008022",
//             "category_id": 97,
//             "order": 1659,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1008022.webp",
//             "count": 2,
//             "price": 100,
//             "total_price": 200,
//             "barcode": "4620017456742",
//             "teh_name": "Завтрак готовый шок.шарик 200г Leonardo",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "7Р-00000012",
//         {
//             "status": "",
//             "name": "Спагетти Bottega del Sole 500г",
//             "article": "7Р-00000012",
//             "category_id": 91,
//             "order": 551,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/7Р-00000012.webp",
//             "count": 1,
//             "price": 65,
//             "total_price": 65,
//             "barcode": "4690329010932",
//             "teh_name": "Спагетти 500г Bottega del Sole",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "ЦР-1005473",
//         {
//             "status": "",
//             "name": "Макаронные изделия Makfa Спагетти 400г",
//             "article": "ЦР-1005473",
//             "category_id": 91,
//             "order": 565,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/ЦР-1005473.webp",
//             "count": 1,
//             "price": 77,
//             "total_price": 77,
//             "barcode": "4601780018290",
//             "teh_name": "Макароны Лапша длин 400г Макфа",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "7Н-00000014",
//         {
//             "status": "",
//             "name": "Мука Makfa пшеничная хлебопекарная высший сорт 1000г",
//             "article": "7Н-00000014",
//             "category_id": 90,
//             "order": 541,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/7Н-00000014.webp",
//             "count": 1,
//             "price": 84,
//             "total_price": 84,
//             "barcode": "4601780002572",
//             "teh_name": "Мука 1кг Макфа (10)",
//             "base_units": "шт"
//         }
//     ],
//     [
//         "PACKAGE",
//         {
//             "status": "",
//             "name": "Пакет \"Мечта\"",
//             "article": "PACKAGE",
//             "category_id": -1,
//             "order": 500,
//             "img": "https://s3.ru1.storage.beget.cloud/3a14ed2c58b6-mechta/paket.png",
//             "count": 1,
//             "price": 5,
//             "total_price": 5,
//             "barcode": null,
//             "teh_name": null,
//             "base_units": "шт"
//         }
//     ]
// ]

function convertTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  // const secondsRem = (seconds - minutes * 60) % 60; // не используется

  if (minutes > 0) {
    return `${hours > 0 ? hours + 'ч ' : ''}${minutes}м`;
  } else {
    return '0м';
  }
}
function getSecondsInWork(datetime_str) {
  // Если createdAt отсутствует или равен null, возвращаем 0
  if (!datetime_str) return 0;

  const created = new Date(datetime_str);       // парсим дату создания (UTC)
  const now = new Date();                          // текущее локальное время

  const diffMs = now - created;                    // разница в миллисекундах
  const totalSeconds = Math.floor(diffMs / 1000);  // полная разница в секундах

  // Имитация .seconds из Python: оставляем только секунды в пределах одного дня
  const secondsInDay = totalSeconds % 86400;

  // Вычитаем 3 часа (поправка, аналогичная Python)
  return secondsInDay - 3600 * 3;
}
function updateTimer() {
  const seconds_in_work = getSecondsInWork(orders_info[order_id]["start_work_datetime"])
  const formatted = convertTime(seconds_in_work);
  document.querySelector(".order-header span.time_in_work").textContent = formatted;
}

function get_product_card_str(id, name, img, count, prcie, total_price, barcode, teh_name, type_units, status) {
  return `<div class="card ${status}" data-id="${id}">
      <img data-nuxt-pic="" src="${img}" srcset="${img} 256w, ${img} 512w">
      <div class="title">
        ${name}
      </div>
      <div class="teh_name">
        ${teh_name}
      </div>
      <div class="row_list">
        <div class="row">
          <span class="label">Кол:</span>
          <span class="value">${count} ${type_units}</span>
        </div>

        <div class="row">
          <span class="label">Цена:</span>
          <span class="value">${prcie}</span>
        </div>

        <div class="row">
          <span class="label">Общая сумма:</span>
          <span class="value">${total_price}</span>
        </div>

        <div class="row">
          <span class="label">ШК:</span>
          <span class="value">${barcode}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn success" onclick='change_card_status("${id}", "READY")'>✅</button>
        <button class="btn edit" onclick='change_card_status("${id}", "TO_REPAIRS")'>🔨</button>
        <button class="btn danger" onclick='change_card_status("${id}", "CANCEL")'>❌</button>
      </div>
    </div>
`
}
async function request_get_order_info(order_id) {
  try {
    const response = await fetch(
      `https://api.mechta-crimea.ru/content-manager/collection-types/api::order.order/${order_id}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
async function request_get_product_id(product_sale_id) {
    const response = await fetch(
      `https://api.mechta-crimea.ru/content-manager/relations/sale.product/${product_sale_id}/product?pageSize=5&page=1`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      });

    return await response.json();
  // } catch (error) {
  //   // console.error(error);
  // }
}
async function request_get_product_info(product_id) {
  try {
    console.log(`https://api.mechta-crimea.ru/content-manager/collection-types/api::product.product/${product_id}`)
    const response = await fetch(
      `https://api.mechta-crimea.ru/content-manager/collection-types/api::product.product/${product_id}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      });

    return await response.json();
  } catch (error) {
    // console.error(error);
  }
}
async function request_get_category_info(product_id) {
  try {
    const response = await fetch(
      `https://api.mechta-crimea.ru/content-manager/relations/api::product.product/${product_id}/category?pageSize=5&page=1`, 
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      });

    return await response.json();
  } catch (error) {
    // console.error(error);
  }
}
async function request_get_phone_info(buyer_id) {
  try {
    const response = await fetch(
      `https://api.mechta-crimea.ru/content-manager/collection-types/plugin::users-permissions.user/${buyer_id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      });

    return await response.json();
  } catch (error) {
    // console.error(error);
  }
}

function show_confirm_popup_ready(id, status, count) {
  document.body.classList.add('modal-open');
  popup_html = `
<div class="modal-overlay" id="overlay">
  <div class="modal-content">
    <p>Подтвердите количество</p>
    <div class="modal-message">${count}</div>
    <div class="modal-actions">
      <button class="modal-btn modal-confirm" id="modalConfirmBtn" onclick="applyStatusChange('${id}', '${status}', ''); hide_popup();"
      >Да, все верно</button>
      <button class="modal-btn modal-cancel" id="modalCancelBtn" onclick = "hide_popup()">Отмена</button>
    </div>
  </div>
</div>`
  document.body.insertAdjacentHTML('beforeend', popup_html);
  const overlay = document.querySelector(`#overlay`);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      console.log(event.target)
      hide_popup();
    }
  });
}
function show_to_repairs_popup_ready(id, status, _) {
  document.body.classList.add('modal-open');
  let checkboxesHtml = '';
  reasonsList.forEach((reason, _) => {
    checkboxesHtml += `
      <label style="display: block; margin-bottom: 8px;">
        <input type="checkbox" value="${reason}" onclick="check_repair_send_button()"> ${reason}
      </label>
    `;
  });

  const popupHtml = `
    <div class="modal-overlay" id="overlay">
      <div class="modal-content">
        <p>Укажите причину(ы)</p>
        <div class="repair-list" style="text-align: left; margin: 20px 0;">
          ${checkboxesHtml}
        </div>
        <div class="modal-actions">
          <button class="modal-btn modal-confirm" id="repairConfirmBtn" disabled>Укажите причину</button>
          <button class="modal-btn modal-cancel" id="repairCancelBtn" onclick = "hide_popup()">Отмена</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popupHtml);

  const confirmBtn = document.getElementById('repairConfirmBtn');
  const overlay = document.querySelector(`#overlay`);
  confirmBtn.addEventListener('click', () => {
    const checkboxes = overlay.querySelectorAll('input[type="checkbox"]:checked');
    const selectedReasons = Array.from(checkboxes).map(cb => cb.value);
    if (selectedReasons.length === 0) {
      // alert('Выберите хотя бы одну причину');
      return;
    }
    applyStatusChange(id, status, { reasons: selectedReasons });
    hide_popup();
  });
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      console.log(event.target)
      hide_popup();
    }
  });
}
function check_repair_send_button() {
  if (document.querySelector(`.repair-list`).querySelector('input[type="checkbox"]:checked')) {
    document.getElementById("repairConfirmBtn").disabled = false
    document.getElementById("repairConfirmBtn").textContent = "Отправить на проверку"
  }
  else {
    document.getElementById("repairConfirmBtn").disabled = true
    document.getElementById("repairConfirmBtn").textContent = "Укажите причину"
  }
}
function hide_popup() {
  document.body.classList.remove('modal-open');
  document.getElementById("overlay").remove()
  // document.getElementById('overlay').style.display = 'none';
  // pending_id = null;
  // pending_status = null;
}
function allProductsHaveStatus() {
  const order = orders_info[order_id];
  if (!order || !order.products) return false; // если нет заказа или продуктов

  const products = order.products;
  for (let id in products) {
    if (products[id].status === "") {
      return false; // нашли товар без статуса
    }
  }
  return true; // все товары имеют непустой статус
}
function applyStatusChange(id, status, info) {
  let product_status = "";
  const card = document.querySelector(`.card[data-id="${id}"]`);
  
  if (status == "READY") {
    if (card.classList.contains("ready")) {
      card.className = "card";
      product_status = "";
    } else {
      card.className = "card ready";
      product_status = "READY";
    }
  } else if (status == "TO_REPAIRS") {
    if (card.classList.contains("to_repairs")) {
      card.className = "card";
      product_status = "";
    } else {
      card.className = "card to_repairs";
      product_status = `TO_REPAIRS###${JSON.stringify(info)}`;
    }
  } else if (status == "CANCEL") {
    if (card.classList.contains("cancel")) {
      card.className = "card";
      product_status = "";
    } else {
      card.className = "card cancel";
      product_status = "CANCEL";
    }
  } else {
    card.className = "card";
    product_status = "";
  }
  
  orders_info[order_id]["products"][id]["status"] = product_status;
  localStorage.setItem('orders_in_sborke', JSON.stringify(orders_info));
  
  if (allProductsHaveStatus()) {
    document.querySelector('.finish-btn').textContent = "Завершить подбор";
    document.querySelector('.finish-btn').disabled = false;
  } else {
    document.querySelector('.finish-btn').textContent = "Нужно отметить все товары";
    document.querySelector('.finish-btn').disabled = true;
  }
}
function change_card_status(id, status) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  // Если это READY и количество товара > 1 — показываем подтверждение
  if (status === "READY" && orders_info[order_id]["products"][id]["count"] > 1 && !card.classList.contains("ready")) {
    show_confirm_popup_ready(id, status, orders_info[order_id]["products"][id]["count"]);
    return; // не применяем статус сразу
  }
  if (status === "TO_REPAIRS" && !card.classList.contains("to_repairs")) {
    show_to_repairs_popup_ready(id, status, '');
    return; // не применяем статус сразу
  }
  // Иначе применяем сразу
  applyStatusChange(id, status);
}
function generate_cards(products_array) {
  status_class_dict = {
    "READY": "ready",
    "TO_REPAIRS": "to_repairs",
    "CANCEL": "cancel",
    "": "",
  }
  card_inner_html = ""
  for (const product of products_array) {
    product[1]["status"] = product[0] in orders_info[order_id]["products"] ? orders_info[order_id]["products"][product[0]]["status"] : product[1]["status"]
    orders_info[order_id]["products"][product[0]] = product[1]
    card_inner_html += get_product_card_str(
      product[0],
      product[1]["name"],
      product[1]["img"],
      product[1]["count"],
      product[1]["price"],
      product[1]["total_price"],
      product[1]["barcode"],
      product[1]["teh_name"],
      product[1]["base_units"],
      status_class_dict[product[1]["status"].split('###')[0]],
    )
  }
  document.querySelector('div[class="cards_list"]').innerHTML = card_inner_html
}

function collectOrderData() {
  // let teh_data = {
  //   "id": order_id,
  //   "type_data": "data",
  //   "errors": [],
  // }
  // let message_data = {
  //   "type_message": "sborka_done",
  //   "type_data": "message",
  //   "message": "",
  // }
  let data = {
    "id": order_id,
    "errors": "",
    "message": "",
  }

  for (id in orders_info[order_id]["products"]) {
    const p_info = orders_info[order_id]["products"][id]
    const status = p_info["status"].split("###")[0]
    // message_data["message"] += `${statuses_sbor_dict[status]} ${p_info["name"]}\n`
    // message_data["message"] += ` Количество: ${p_info["base_units"] == "г" ? p_info["count"] / 1000 : p_info["count"]} x ${p_info["price"]}р\n`
    // message_data["message"] += ` Сумма: ${p_info["total_price"]}р`
    data["message"] += `${statuses_sbor_dict[status]} ${p_info["name"]}\n`
    data["message"] += ` Количество: ${p_info["base_units"] == "г" ? p_info["count"] / 1000 : p_info["count"]} x ${p_info["price"]}р\n`
    data["message"] += ` Сумма: ${p_info["total_price"]}р`

    if (status == "TO_REPAIRS") {
      data["errors"].push({
        "id": id,
        "error": JSON.parse(p_info["status"].split("###")[1]),
      })
    }
  }
  // console.log(teh_data, message_data)
  // return [JSON.stringify(teh_data), JSON.stringify(message_data)]
  console.log(data)
  return JSON.stringify(data)
}
async function getCachedData(key, fetchFn) {
  const cached = productCache[key];
  const now = Date.now();
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  try {
    const data = await fetchFn();
    productCache[key] = { data, timestamp: now };
    localStorage.setItem(CACHE_KEY, JSON.stringify(productCache));
    return data;
  } catch (error) {
    console.error(`Ошибка загрузки ${key}:`, error);
    // Если есть устаревшие данные, возвращаем их с предупреждением
    if (cached) {
      console.warn(`Используются устаревшие данные для ${key}`);
      return cached.data;
    }
    throw error; // или обработать иначе
  }
}
async function loadProductData(productSaleInfo) {
  // Получаем product_id
  const productIdResp = await request_get_product_id(productSaleInfo.id);
  const productId = productIdResp.data.id;

  // Параллельно запрашиваем информацию о товаре и категорию
  const [productInfo, categoryResp] = await Promise.all([
    getCachedData(`prod_${productId}`, () => request_get_product_info(productId)),
    getCachedData(`cat_${productId}`, () => request_get_category_info(productId))
  ]);

  const categoryId = categoryResp.results.length > 0 ? categoryResp.results[0].id : -1;

  return {
    status: "",
    id: productInfo.id,
    name: productSaleInfo.name,
    article: productInfo.article,
    category_id: categoryId,
    order: productInfo.order,
    img: productInfo.images[0],
    count: productSaleInfo.count,
    price: productSaleInfo.price,
    total_price: productSaleInfo.totalPrice,
    barcode: productInfo.barcode,
    teh_name: productInfo.technicalName,
    base_units: productSaleInfo.baseUnits,
  };
}

async function main() {
  const order_info = await request_get_order_info(order_id);
  products_not_filter = {}
  phonePromise = await request_get_phone_info(order_info["userId"])
  orders_info[order_id]["start_work_datetime"] = order_info["createdAt"]

  const product_promises = order_info.check.composition.map(item => loadProductData(item))
  const products_promieses_done = await Promise.all(product_promises)
  products_promieses_done.forEach(p => {products_not_filter[p.id] = p})

  const products_array = Object.entries(products_not_filter)
    .sort(([, a], [, b]) => {
      if (a.category_id !== b.category_id) {
        return b.category_id - a.category_id;
      }
      return a.order - b.order;
  });
  phone_info = await phonePromise
  orders_info[order_id]["phone_number"] = phone_info["phone"]
  document.querySelector("div.order-header div.order-id span.order_id").textContent = order_id
  document.querySelector(".order-header a.order-phone").textContent = `+${orders_info[order_id]['phone_number']}`
  document.querySelector(".order-header a.order-phone").href = `tel:+${orders_info[order_id]['phone_number']}`
  document.querySelector(".order-header span.time_in_work").textContent = convertTime(orders_info[order_id]["in_work"])
  generate_cards(products_array)
  localStorage.setItem('orders_in_sborke', JSON.stringify(orders_info));

  // Запускаем интервал (например, каждые 10 секунд)
  setInterval(updateTimer, 10000);
  document.querySelector('.finish-btn').addEventListener('click', function() {
    const data = collectOrderData();
    tg.sendData(data);
    tg.close();
  });
  document.querySelector('.spin-wrapper').remove()
}

main();

// Для оффлайн тестов

// document.querySelector("div.order-header div.order-id span.order_id").textContent = order_id
// document.querySelector(".order-header a.order-phone").textContent = `+${orders_info[order_id]['phone_number']}`
// document.querySelector(".order-header a.order-phone").href = `tel:+${orders_info[order_id]['phone_number']}`
// document.querySelector(".order-header span.time_in_work").textContent = convertTime(orders_info[order_id]["in_work"])
// generate_cards(products_array)
// document.querySelector('.finish-btn').addEventListener('click', function() {
//   const data = collectOrderData();
//   tg.sendData(data);   // отправляем боту
//   tg.close();          // закрываем веб-приложение (опционально)
// });

// document.querySelector('.spin-wrapper').remove()

// // Запускаем интервал (например, каждые 10 секунд)
// setInterval(updateTimer, 10000);
  

// // console.log(products_array)

