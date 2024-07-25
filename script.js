function addBet(b_type, b_id) {}

const INNER_HEIGHT = window.innerHeight;

window.addEventListener('scroll', () => {
  document.querySelector('._js').textContent = `${37} ${document.body.scrollTop} ${window.innerHeight}`;
  if (window.innerHeight < INNER_HEIGHT) {
    window.innerHeight = INNER_HEIGHT;
  }
})