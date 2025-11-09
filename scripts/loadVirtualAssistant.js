fetch("../html/virtual_assistant.html") // Obtenir le fichier HTML de l'assistant virtuel
.then(response => response.text()) // Transformer le HTML en texte
.then(data => {
    document.getElementById("virtual-assistant").innerHTML = data; // Mettre le contenu de virtual_assistant.html dans la div "virtual-assistant"

    // Importer le script virtualAssistant.js
    const script = document.createElement("script");
    script.type = "module";
    script.src = "../scripts/virtualAssistant.js";
    document.body.appendChild(script);

    // Script qui s'exécute après importation de l'assistant virtuel -->

    // Redimensionnement de la chat box
    const chatBox = document.getElementById("chat-box");
    const handle = document.getElementById("resize-handle");

    handle.addEventListener("mousedown", (e) => { // Quand l'utilisateur appuie sur la poignée
        e.preventDefault(); // Empêche de sélectionner le texte en même temps que bouger la souris
        const startX = e.clientX; // Position X de la souris
        const startY = e.clientY; // Position Y de la souris
        const startWidth = chatBox.offsetWidth; // Largeur de la chat box
        const startHeight = chatBox.offsetHeight; // Hauteur de la chat box
        const startTop = chatBox.offsetTop; // Position de la chat box
        const startLeft = chatBox.offsetLeft; // Position de la chat box

        const minWidth = 300; // Largeur minimum
        const minHeight = 200; // Hauteur minimum

        function onMouseMove(e) { // Quand la souris bouge
            const newWidth = startWidth - (e.clientX - startX); // Nouvelle largeur calculée
            const newHeight = startHeight - (e.clientY - startY); // Nouvelle hauteur calculée

            if(newWidth < minWidth || newHeight < minHeight) { // Si la nouvelle largeur ou la nouvelle longueur est plus petitte que le minimum
                return; // Annuler l'agrandissement ou le rétrécissement de la chat box
            }

            chatBox.style.width = newWidth + "px"; // Appliquer la nouvelle largeur au CSS
            chatBox.style.height = newHeight + "px"; // Appliquer la nouvelle hauteur au CSS
            chatBox.style.top = startTop + (e.clientY - startY) + "px"; // Appliquer la nouvelle position au CSS
            chatBox.style.left = startLeft + (e.clientX - startX) + "px"; // Appliquer la nouvelle position au CSS
        }

        function onMouseUp() { // Quand l'utilisateur arrête d'appuyer
            window.removeEventListener("mousemove", onMouseMove); // Enlever l'évènement de détection quand la souris bouge
            window.removeEventListener("mouseup", onMouseUp); // Enlever l'évènement de détection quand l'utilisateur arrête d'appuyer
        }

        window.removeEventListener("mousemove", onMouseMove); // Enlever l'évènement de détection quand la souris bouge
        window.removeEventListener("mouseup", onMouseUp); // Enlever l'évènement de détection quand l'utilisateur arrête d'appuyer
    });

    

    



})
.catch(err => console.error("Erreur de chargement de l'assistant virttuel:", err)); // Erreur