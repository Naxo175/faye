fetch("../html/virtual_assistant.html")
.then(response => response.text())
.then(data => {
    document.getElementById("virtual-assistant").innerHTML = data;

    // Importer le script virtualAssistant.js
    const script = document.createElement("script");
    script.type = "module";
    script.src = "../scripts/virtualAssistant.js";
    document.body.appendChild(script);

    // Script qui s'exécute après importation de l'assistant virtuel

    // Redimensionnement de la chat box
    const chatBox = document.getElementById("chat-box");
    const handle = document.getElementById("resize-handle");

    handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = chatBox.offsetWidth;
        const startHeight = chatBox.offsetHeight;
        const startTop = chatBox.offsetTop;
        const startLeft = chatBox.offsetLeft;

        const minWidth = 300;
        const minHeight = 200;

        function onMouseMove(e) {
            const newWidth = startWidth - (e.clientX - startX);
            const newHeight = startHeight - (e.clientY - startY);

            if(newWidth < minWidth || newHeight < minHeight) {
                return;
            }

            chatBox.style.width = newWidth + "px";
            chatBox.style.height = newHeight + "px";
            chatBox.style.top = startTop + (e.clientY - startY) + "px";
            chatBox.style.left = startLeft + (e.clientX - startX) + "px";
        }

        function onMouseUp() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    });

    

    



})
.catch(err => console.error("Erreur de chargement de l'assistant virttuel:", err));