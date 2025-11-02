window.onload = updateBackgroundPosition;
window.addEventListener('scroll', updateBackgroundPosition);

function updateBackgroundPosition() {
    const scrollY = window.scrollY;
    const body = document.body;
  
    const posY = scrollY * 0.5;

    body.style.backgroundPosition = `0px ${-1200 + posY}px`;
}