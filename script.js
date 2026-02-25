const params = new URLSearchParams(window.location.search);
const user_token = params.get("user_token");
const order_id = params.get("order_id");

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

function get_product_card_str(name, article, img, count, prcie, total_price, barcode, teh_name, type_units) {
  return `<div class="card" data-id="${article}">
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
        <button class="btn success" onclick='change_card_status("${article}", "READY")'>✅</button>
        <button class="btn edit" onclick='change_card_status("${article}", "TO_REPAIRS")'>🔨</button>
        <button class="btn danger" onclick='change_card_status("${article}", "CANCEL")'>❌</button>
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
function change_card_status(article, status) {
  products[article] = status
  card = document.querySelector(`.card[data-id="${article}"]`)
  if (status == "READY") {
    if (card.classList.contains("ready")) {
      card.classList.remove("ready")
    }
    else {
      card.className = "card ready" 
    }
  }
  else if (status == "TO_REPAIRS") {
    if (card.classList.contains("to_repairs")) {
      card.classList.remove("to_repairs")
    }
    else {
      card.className = "card to_repairs" 
    }
  }
  else if (status == "CANCEL") {
    if (card.classList.contains("cancel")) {
      card.classList.remove("cancel")
    }
    else {
      card.className = "card cancel" 
    }
  }
  else {
    card.className = "card"
  }
}

async function main() {
  const order_info = await request_get_order_info(order_id);
  products_not_filter = {}
  for (const product_sale_info of order_info.check.composition) {
    product_id = await request_get_product_id(product_sale_info["id"])
    product_id = product_id["data"]["id"]
    product_info = await request_get_product_info(product_id)
    category_info = await request_get_category_info(product_id)
    category_id = -1
    if (category_info.results.length > 0) {
      category_id = category_info.results[0].id;
    }
    
    products_not_filter[product_info["article"]] = {
      "status": null,
      "name": product_sale_info["name"],
      "article": product_info["article"],
      "category_id": category_id,
      "order": product_info["order"],
      "img": product_info["images"][0],
      "count": product_sale_info["count"],
      "price": product_sale_info["price"],
      "total_price": product_sale_info["totalPrice"],
      "barcode": product_info["barcode"],
      "teh_name": product_info["technicalName"],
      "base_units": product_sale_info["baseUnits"],
    }
  }
  
  const products_array = Object.entries(products_not_filter)
    .sort(([, a], [, b]) => {
      if (a.category_id !== b.category_id) {
        return b.category_id - a.category_id;
      }
      return a.order - b.order;
    });
  
  card_inner_html = ""
  for (const product of products_array) {
    products[product[0]] = product[1]
    card_inner_html += get_product_card_str(
      product[1]["name"],
      product[1]["article"],
      product[1]["img"],
      product[1]["count"],
      product[1]["price"],
      product[1]["total_price"],
      product[1]["barcode"],
      product[1]["teh_name"],
      product[1]["base_units"],
    )
  }
  document.querySelector('div[class="cards_list"]').innerHTML = card_inner_html
  document.querySelector('.spin-wrapper').remove()
}

main();

