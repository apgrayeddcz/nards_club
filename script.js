// var start = performance.now();
// var end = performance.now();
// console.log(end - start);

// webView.getSettings().setUseWideViewPort(false);


let ACTIVE_BET_SIZE = 2;
let ACTIVE_BET_SIZE_BUTTON = document.querySelectorAll('ul.panel_bet-size_list li')[ACTIVE_BET_SIZE];
const BET_LIST_EMPTY = () => JSON.parse(JSON.stringify({
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
  17: 0,
  18: 0,
  19: 0,
  20: 0,
  21: 0,
  22: 0,
  23: 0,
  24: 0,
}));
const bet_size_list = [10, 50, 100, 500, 1000];

let bets_history = [];
let last_bets = false;
let bet_list = BET_LIST_EMPTY();

function addLastBets() {
  if (last_bets) {
    for (let key in last_bets) {
      if (last_bets[key] > 0) {
        addBet(document.querySelector(`button[data-id="${key}"]`), key, last_bets[key])
      }
    }
  }
}
function cancelAllBets() { //0.2
  var start = performance.now();
  if (bets_history.length) {
    bet_list = BET_LIST_EMPTY();
    document.querySelectorAll('button[data-id].active').forEach(e => {
      e.classList.remove('active'); 
      const b_size = e.querySelector('.bet-size');
      b_size.style.display = 'none';
    })
  }
  var end = performance.now();
  console.log(end - start);
}
function cancelLastBet() { //0.1
  if (bets_history.length) {
    const i = bets_history.at(-1)
    bets_history.pop()
    bet_list[i['id']] -= i['value']

    const b_size = i['e'].querySelector('.bet-size');
    if (bet_list[i['id']] == 0) {i['e'].classList.remove(`active`);b_size.style.display = 'none';}else{b_size.querySelector('span').textContent = bet_list[i['id']];};
  }
}
function addBet(e, id, value = false) {  // 0.1
  const b_size = e.querySelector('.bet-size');
  if (bet_list[id] == 0) {e.classList.add(`active`);b_size.style.display = 'flex'};
  const b_value = value ? value : bet_size_list[ACTIVE_BET_SIZE];
  bet_list[id] += b_value;
  bets_history.push({'e': e, 'id': id, 'value': b_value});
  b_size.querySelector('span').textContent = bet_list[id];
}
function changeBetSize(e, id) { //0
  ACTIVE_BET_SIZE = id;
  ACTIVE_BET_SIZE_BUTTON.classList.remove('active');
  ACTIVE_BET_SIZE_BUTTON = e;
  ACTIVE_BET_SIZE_BUTTON.classList.add('active');
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
changeBetSize(ACTIVE_BET_SIZE_BUTTON, ACTIVE_BET_SIZE)
