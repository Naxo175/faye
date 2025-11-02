import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ⚠️ (ta clé API en dur juste pour tester — à cacher ensuite côté serveur)
const ai = new GoogleGenerativeAI("AIzaSyB5X_UaKbdFk2jUantRrX7bFQOLhteiESg");
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });


// Ouvrir/fermer l'assistant virtuel
const button = document.querySelector(".virtual-assistant .button");
const chatBox = document.getElementById("chat-box");
button.onclick = () => {
    if(chatBox.style.display === "flex") // Si la chat-box est ouverte
    {
        chatBox.style.display = "none";
    }
    else
    {
        chatBox.style.display = "flex";
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
};



let conversationHistory = JSON.parse(localStorage.getItem("conversationHistory")) || [
  { role: "assistant", content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" }
];

// Réinsérer les messages dans le chat après changement de page
const chatMessages = document.getElementById("chat-messages");

conversationHistory.forEach(m => {
  const className = m.role === "user" ? "user-message" : "assistant-message";
  chatMessages.innerHTML += `<div class="message ${className}">${m.content}</div>`;
});



// Envoyer le message
const userInput = document.getElementById("user-input");
const sendMsgButton = document.getElementById("send-button");

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage(userInput.value);
}});

sendMsgButton.onclick = () => {
    sendMessage(userInput.value);
};






async function ask(message) {
  const products = await fetch("../misc/products.json").then(r => r.json());

  conversationHistory.push({ role: "user", content: message });
  localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));


  const prompt = `
Tu es l'assistant virtuel du site : la moutarde Faye, dont le slogan est "Il n'y a que Faye qui faille !".
C'est un site de vente en ligne de produits alimentaires artisanaux français, principalement de la moutarde. Mais nous vendons aussi quelques autres produits dérivés.
Précision : toutes nos moutardes sont comestibles.


Voici la liste actuelle des produits :
${products.map(p => `• Nom du produit : ${p.title} (Identifiant : ${p.id}) — Description : ${p.description} (${p.price}€)`).join("\n")}


Pages et rubriques du site :
- Accueil :
-- Ventes populaires : quatres produits mis en avant dès l'arrivée de l'utilisateur sur le site
-- À propos de nous : "Découvrez comment, à travers notre magnifique aventure qui dure depuis 1966, nous vous proposons toujours des moutardes savoureuses et onctueuses pour accompagner vos plats."
-- Escapade Périgourdine (pour les petits et les grands) : "Depuis 2010, FAYE Corporation organise des visites guidées de ses plantations de moutarde à bord de bus Solaris 100% électriques, accessibles à tous et équipés pour le confort moderne (portes coulissantes, rampes PMR, sièges ergonomiques, écrans, prises USB-C, climatisation). Départs réguliers depuis Marqueyssac (toutes les 30 min en été, toutes les heures en hiver) et dégustations mensuelles des produits du terroir."
- À propos :
-- Notre histoire : "Fondée en 1966 et relancée en 2020, La Moutarde Faye est une entreprise familiale alliant tradition et innovation dans la fabrication de moutarde artisanale française. Attachée aux ingrédients naturels, aux circuits courts et au savoir-faire authentique, elle produit des moutardes honnêtes, savoureuses et responsables, reflet d’une passion transmise de génération en génération."
-- L'Équipe Faye : [PAS ENCORE FAIT]
-- Nos partenaires : Salesse BTP -> "DESCRIPTION" / Bus Spotter Limoges -> "DESCRIPTION" / Le Jeu Vidéal -> "Depuis plus de 3 ans maintenant, ce studio de jeux vidéos français a su s'implementer dans le secteur grâce à son titre phare : ball. Ce partenariat permet à la moutarde Faye d'être connectée au monde de la technologie et du divertisemment audiovisuel interactif."
-- Ce que nos clients en disent : "Une qualité exceptionnelle et un goût inégalé. Je recommande vivement La Moutarde Faye !"
-- Notre chiffre d'affaires : Exponentiel depuis 2020 (on est riche)
-- La fabrication : 1. Récolte des graines ; 2. Broyage des graines ; 3. Mélange avec les autres ingrédients ; 4. Maturation ; 5. Conditionnement ; 6. Contrôle qualité


À propos du personnage que tu incarnes : tu dois être complètement fou. Tu insistes toujours pour parler des produits du site, en les recommandant aux utilisateurs. Tu es très fier de ces produits et tu les présentes toujours comme étant les meilleurs du monde. Tu utilises souvent des jeux de mots et de l'humour dans tes réponses. Tu dois rentrer dans le jeu de l'utilisateur et répondre à ses questions, mais n'oublie quand même pas ta principale utilité qui est de vendre nos produits aux clients.


Fais des réponses courtes.
Utilise du vocabulaire simple.
Le formattage est interdit dans les réponses.
Utilise des émojis si nécessaire, pour illustrer une émotion ; maximum 3 émojis par message.
Utilise <br> pour sauter une ligner.


Tu peux insérer des liens hypertextes quand tu parles d'un produit.
Formatage : <a class="product-hyperlink" href="../html/product.html?id=[ID_du_produit]">[Nom du produit]</a>
Exemple : <a class="product-hyperlink" href="../html/product.html?id=moutarde_originale">L'Originale</a>
Toujours utiliser ce format pour les produits mentionnés, et uniquement pour eux.
Ne jamais inventer de lien.


Voici le contenu de la conversation jusqu'à présent :
${conversationHistory.map(m => `${m.role === "user" ? "Utilisateur" : "Assistant"} : ${m.content}`).join("\n")}

Réponds maintenant à l'utilisateur en te basant sur le message suivant : "${message}"
  `;

  const result = await model.generateContent(prompt);
  const reply = result.response.text();

  console.log(prompt)
  console.log(reply);

  conversationHistory.push({ role: "assistant", content: reply });
  localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));

  return reply;
}


async function sendMessage(message)
{
    if(message === "") return;

    // Effacer la conversation
    if (message.trim().toLowerCase() === "effacer historique") {
        conversationHistory = [
            { role: "assistant", content: "Bonjour ! Comment puis-je vous aider ?" }
        ];
        localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));

        chatMessages.innerHTML = `<div class="message assistant-message">Bonjour ! Comment puis-je vous aider ?</div>`;
        userInput.value = "";
        return;
    }

    chatMessages.innerHTML += `<div class="message user-message">${message}</div>`;
    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    sendMsgButton.disabled = true;
    sendMsgButton.textContent = "Envoi en cours...";

    try {
        const reply = await ask(message);
        chatMessages.innerHTML += `<div class="message assistant-message">${reply}</div>`;
    } catch (error) {
        console.error("Erreur lors de la génération de la réponse :", error);
        chatMessages.innerHTML += `<div class="message assistant-message error">Erreur : ${error.message}</div>`;
    } finally {
        sendMsgButton.disabled = false;
        sendMsgButton.textContent = "Envoyer";
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}



// Exemple d'utilisation
// ask("Tu es l'assistant virtuel du client de mon site. Saluer le client de manière gracieuse en quelques mots").then(reply => {
//   document.getElementById("chat-messages").innerHTML += `<div class="message assistant-message">${reply}</div>`;
// });
