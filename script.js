function addBet(b_type, b_id) {}
function changeBetSize(s_id) {}


function checkListInStr(list, str) {
  list.forEach(elem => {
    if (str.indexOf(elem) > 0) {
      return true
    }
  });
}
// /iPhone|iPad|iPod/i.test(navigator.userAgent)


window.addEventListener('onload', () => {
  if (navigator.userAgent.indexOf('iPhone') > 0) {
    const INNER_HEIGHT = window.innerHeight;

    const headers = document.querySelector('headers');
    const panel = document.querySelector('.panel');
    const main = document.querySelector('main');

    panel.style.paddingBottom = `${6.66}vw`
    window.addEventListener('scroll', () => {
      document.querySelector('._js').textContent = `${32} ${document.body.scrollTop} ${window.innerHeight}`;
      if (window.innerHeight < INNER_HEIGHT) {
        headers.style.top = `${INNER_HEIGHT - window.innerHeight}px`;
        panel.style.bottom = `-${INNER_HEIGHT - window.innerHeight}px`;
        main.style.paddingBottom = panel.style.height - (INNER_HEIGHT - window.innerHeight);
      }
      else {
        headers.style.top = 0;
        panel.style.bottom = 0;
        main.style.paddingBottom = panel.style.height;
      }
    })
  }
})
