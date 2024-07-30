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

if (checkListInStr(['iPhone','iPad','iPod'], navigator.userAgent)) {
  const INNER_HEIGHT = window.innerHeight;

  const headers = document.querySelector('headers');
  const panel = document.querySelector('.panel');
  const main = document.querySelector('main');

  panel.style.paddingBottom = `${9.66}vw`;
  main.style.paddingBottom = `${37.66}vw`;
  
  window.addEventListener('scroll', () => {
    if (window.innerHeight < INNER_HEIGHT) {
      headers.style.top = `${INNER_HEIGHT - window.innerHeight}px`;
      panel.style.bottom = `-${INNER_HEIGHT - window.innerHeight}px`;
      // main.style.paddingBottom = panel.style.height - (INNER_HEIGHT - window.innerHeight);
    }
    else {
      headers.style.top = 0;
      panel.style.bottom = 0;
      // main.style.paddingBottom = panel.style.height;
    }
    document.querySelector('._js').textContent = `${47} ${document.body.scrollTop} ${window.innerHeight} ${main.style.paddingBottom}`;
  
  })
}
