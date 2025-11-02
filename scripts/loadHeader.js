fetch("../html/header.html")
.then(response => response.text())
.then(data => {
    document.getElementById("header").innerHTML = data;
})
.catch(err => console.error("Erreur de chargement du header:", err));