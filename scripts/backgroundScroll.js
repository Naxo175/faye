window.onload = updateBackgroundPosition; // Appeler la fonction dès le chargement de la page
window.addEventListener('scroll', updateBackgroundPosition); // Appeler la fonction quand l'utilisateur scroll sur la page

function updateBackgroundPosition() {
    const scrollY = window.scrollY; // Récupérer le scroll actuel de la page
    const body = document.body; // Body de la page
  
    const posY = scrollY * 0.5; // Calculer la position Y du background

    body.style.backgroundPosition = `0px ${-1200 + posY}px`; // Mettre à jour la position Y du background
}