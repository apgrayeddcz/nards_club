function addBet(b_type, b_id) {}
function changeBetSize(s_id) {}


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

if (checkListInStr(['iPhone','iPad','iPod'], navigator.userAgent)) {
  const INNER_HEIGHT = window.innerHeight;
  const main_pd_b = 37.66

  const headers = document.querySelector('headers');
  const panel = document.querySelector('.panel');
  const main = document.querySelector('main');

  panel.style.paddingBottom = `${9.66}vw`;
  main.style.paddingBottom = `${main_pd_b}vw`;
  
  window.addEventListener('scroll', () => {
    if (window.innerHeight < INNER_HEIGHT) {
      headers.style.top = `${INNER_HEIGHT - window.innerHeight}px`;
      panel.style.bottom = `-${INNER_HEIGHT - window.innerHeight}px`;
      main.style.paddingBottom = `${main_pd_b - convert_px_to_vw(INNER_HEIGHT - window.innerHeight)}vw`;
    }
    else {
      headers.style.top = 0;
      panel.style.bottom = 0;
      main.style.paddingBottom = `${main_pd_b}vw`;
    }
    document.querySelector('._js').textContent = `${50} ${document.body.scrollTop} ${window.innerHeight} ${main.style.paddingBottom}`;
  
  })
}
