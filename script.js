function addBet(b_type, b_id) {}

const INNER_HEIGHT = window.innerHeight;

window.addEventListener('scroll', () => {
  document.querySelector('._js').textContent = `${37} ${document.body.scrollTop} ${window.innerHeight}`;
  if (window.innerHeight < INNER_HEIGHT) {
    document.querySelector('headers').style.top = `${INNER_HEIGHT - window.innerHeight}px`;
    document.querySelector('.panel').style.bottom = `-${INNER_HEIGHT - window.innerHeight}px`;
  }
  else {
    document.querySelector('headers').style.top = 0;
    document.querySelector('.panel').style.bottom = 0;
  }
})