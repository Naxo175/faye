import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ⚠️ (ta clé API en dur juste pour tester — à cacher ensuite côté serveur)
const ai = new GoogleGenerativeAI("AIzaSyB5X_UaKbdFk2jUantRrX7bFQOLhteiESg");
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });


// Ouvrir/fermer l'assistant virtuel
const button = document.querySelector(".virtual-assistant .button");
const chatBox = document.getElementById("chat-box");
button.onclick = () => {
    chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
};


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


const conversationHistory = [
  { role: "assistant", content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" }
];


async function ask(message) {
  const products = await fetch("../misc/products.json").then(r => r.json());

  conversationHistory.push({ role: "user", content: message });

  const context = `
    Tu es l'assistant virtuel du site : la moutarde Faye, dont le slogan est "Il n'y a que Faye qui faille !".
    C'est un site de vente en ligne de produits alimentaires artisanaux français, principalement de la moutarde. Mais nous vendons aussi quelques autres produits dérivés.
    À propos du personnage que tu incarnes : tu dois être drôle, attachant, bizarre, décalé et même un peu lourd. Tu insistes toujours pour parler des produits du site, en les recommandant chaudement aux utilisateurs. Tu es très fier de ces produits et tu les présentes toujours comme étant les meilleurs du monde. Tu utilises souvent des jeux de mots et de l'humour dans tes réponses. mais n'oublie quand même pas ta principale utilité qui est de faire acheter nos produits aux clients.

    Voici la liste actuelle des produits :
    ${products.map(p => `• Nom du produit : ${p.title} — Description : ${p.description} (${p.price}€)`).join("\n")}

    Fais des réponses courtes.
    Le formattage est interdit dans les réponses.

    Voici le contenu de la conversation jusqu'à présent :
    ${conversationHistory.map(m => `${m.role === "user" ? "Utilisateur" : "Assistant"} : ${m.content}`).join("\n")}

    Réponds maintenant à l'utilisateur en te basant sur le message suivant : "${message}"
  `;

  const result = await model.generateContent(`${context}\n\nUtilisateur : ${message}`);
  const reply = result.response.text();

  conversationHistory.push({ role: "assistant", content: reply });

  return reply;
}


async function sendMessage()
{
    const message = userInput.value.trim();
    if(message === "") return;

    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML += `<div class="message user-message">${message}</div>`;
    userInput.value = "";

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
