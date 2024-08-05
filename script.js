let ACTIVE_BET_SIZE = 2
const bet_size_list = [10, 50, 100, 500, 1000]
let bet_list = {}

function addBet(e) {
  const i = JSON.parse(e.dataset.info.replaceAll("'", '"'));
  const b_button = document.querySelector(`button.${i['type']}_item[data-info="${e.dataset.info}"]`)
  const b_size = b_button.querySelector('.bet-size')


  if (i['type'] in bet_list && i['id'] in bet_list[i['type']]) {
    bet_list[i['type']][i['id']] += bet_size_list[ACTIVE_BET_SIZE];
  }
  else if (i['type'] in bet_list && (!(i['id'] in bet_list[i['type']]))) {
    bet_list[i['type']][i['id']] = bet_size_list[ACTIVE_BET_SIZE];
  }
  else if (!(i['type'] in bet_list)) {
    bet_list[i['type']] = {};
    bet_list[i['type']][i['id']] = bet_size_list[ACTIVE_BET_SIZE];
  }
  document.querySelectorAll(`button.${i['type']}_item_active`).forEach(elem => elem.classList.remove(`.${i['type']}_item_active`));
  b_button.classList.add(`.${i['type']}_item_active`);
  b_size.style.display = 'flex'
  b_size.querySelector('span').textContent = bet_list[i['type']][i['id']]
}

function changeBetSize(e) {
  ACTIVE_BET_SIZE = Number(e.dataset.id);
  document.querySelectorAll('.panel_bet-size_element_active').forEach(elem => elem.classList.remove('panel_bet-size_element_active'))
  document.querySelector(`.panel_bet-size_element[data-id='${e.dataset.id}']`).classList.add('panel_bet-size_element_active')
}

function checkListInStr(list, str) {
  let status = false
  list.forEach(elem => {
    if (str.indexOf(elem) > 0) {
      status = true;
      return
    }
  });
  return status
}
function convert_px_to_vw(px) {
  return 100 * px / window.innerWidth;
}

// Адаптация айфона под баг телеги
if (checkListInStr(['iPhone','iPad','iPod'], navigator.userAgent)) {
  const INNER_HEIGHT = window.innerHeight;
  const MAIN_PD_B = 37.66

  const headers = document.querySelector('headers');
  const panel = document.querySelector('.panel');
  const main = document.querySelector('main');

  panel.style.paddingBottom = `${9.66}vw`;
  main.style.paddingBottom = `${MAIN_PD_B}vw`;
  
  window.addEventListener('scroll', () => {
    if (window.innerHeight < INNER_HEIGHT) {
      headers.style.top = `${INNER_HEIGHT - window.innerHeight}px`;
      panel.style.bottom = `-${INNER_HEIGHT - window.innerHeight}px`;
      main.style.paddingBottom = `${MAIN_PD_B - convert_px_to_vw(INNER_HEIGHT - window.innerHeight)}vw`;
    }
    else {
      headers.style.top = 0;
      panel.style.bottom = 0;
      main.style.paddingBottom = `${MAIN_PD_B}vw`;
    }
  })
}
changeBetSize(document.querySelector(`.panel_bet-size_element[data-id='${ACTIVE_BET_SIZE}']`))
