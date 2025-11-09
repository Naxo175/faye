fetch("../html/header.html") // Récupérer le fichier HTML du header
.then(response => response.text()) // Transforme la réponse du fichier en un texte
.then(data => {
    document.getElementById("header").innerHTML = data; // Met le texte HTML du header dans la div "header" de la page
})
.catch(err => console.error("Erreur de chargement du header:", err)); // Renvoie une erreur s'il y en a une