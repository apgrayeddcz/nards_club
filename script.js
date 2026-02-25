const params = new URLSearchParams(window.location.search);
const user_token = params.get("token");
const order_id = params.get("order_id");
document.querySelector("h1").textContent = order_id

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
products = []

function get_product_card_str(name, img, count, barcode, teh_name, type_units) {
  return `<div class="card">
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
          <span class="label">ШК:</span>
          <span class="value">${barcode}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn success">✅</button>
        <button class="btn edit">🔨</button>
        <button class="btn danger">❌</button>
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
  // try {
    console.log(`https://api.mechta-crimea.ru/content-manager/relations/sale.product/${product_sale_id}/product?pageSize=5&page=1`)
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

async function main() {
  const order_info = await request_get_order_info(order_id);

  for (const product_sale_info of order_info.check.composition) {
    console.log(product_sale_info)
    product_id = await request_get_product_id(product_sale_info["id"])
    product_id = product_id["data"]["id"]
    product_info = await request_get_product_info(product_id)
    category_info = await request_get_category_info(product_id)
    
    document.querySelector('div[class="cards_list"]').innerHTML += get_product_card_str(
      product_sale_info["name"],
      product_info["images"][0],
      product_sale_info["count"],
      product_info["barcode"],
      product_info["technicalName"],
      product_sale_info["baseUnits"],
    )
    // products.push(
    //   {
    //     "id": product["id"],
    //     "article": product_info["article"],
    //     "name": product["name"],
    //     "img": product_info["images"][0],
    //     "type_units": product["baseUnits"],
    //     "count": product["count"],
    //     "barcode": product_info["barcode"],
    //     "teh_name": product_info["technicalName"],
    //     "category": category_info["results"][0]["id"],
    //   }
    // )
  }

  console.log(products)
}

main();

