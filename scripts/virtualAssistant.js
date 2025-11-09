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
-- S'abonner à MultiFaye : "La carte MultiFaye, notre carte de fidélité, vous permettra d'obtenir pleins de réductions sur certains de nos produits. En vous abonnant, vous recevrez chaque semaine un coffret de moutardes gratuit pendant la première semaine."
-- À propos de nous : "Découvrez comment, à travers notre magnifique aventure qui dure depuis 1966, nous vous proposons toujours des moutardes savoureuses et onctueuses pour accompagner vos plats."
-- Escapade Périgourdine (pour les petits et les grands) : "Depuis 2010, FAYE Corporation organise des visites guidées de ses plantations de moutarde à bord de bus Solaris 100% électriques, accessibles à tous et équipés pour le confort moderne (portes coulissantes, rampes PMR, sièges ergonomiques, écrans, prises USB-C, climatisation). Départs réguliers depuis Marqueyssac (toutes les 30 min en été, toutes les heures en hiver) et dégustations mensuelles des produits du terroir."
-- La Taverne de Laurent : "Ouvert en 2021 suite à la pandémie de COVID 19, notre restaurant la Taverne de Laurent vous propose une gastronomie 4 étoiles. Entre saveurs locales et produits du terroir, la Taverne de Laurent saura satisfaire petits et grands. Découvrez nos plats préparés par notre chef Kamal Bouazid, arborés de nos moutardes préparées dans nos usines Périgourdine. Embarquez dans un tourbillon de saveurs auxquelles vous n’avez jamais goûté et savourez nos desserts mêlant parfaitement le raffinement et l’audace. (Tous nos plats et condiments sont méticuleusement préparés avec des produits biologiques.)"
-- Le FayePhone, le téléphone à la sauce Faye : une rubrique qui montre le téléphone en photo ; le slogan du téléphone est "LE TÉLÉPHONE DE VOS PLAISIRS MULTIPLES."
- À propos :
-- Notre histoire : "Fondée en 1966 et relancée en 2020, La Moutarde Faye est une entreprise familiale alliant tradition et innovation dans la fabrication de moutarde artisanale française. Attachée aux ingrédients naturels, aux circuits courts et au savoir-faire authentique, elle produit des moutardes honnêtes, savoureuses et responsables, reflet d’une passion transmise de génération en génération."
-- L'Équipe Faye : 
--- Catherine C. : Directrice de l'usine depuis 2020
--- Christelle S. : Vendeuse depuis 2019
--- Cristophine F. : Serveuse à la Taverne depuis 2023
--- Colette V. : Caissière depuis 1966
--- Dominique G. : Directeur du service informatique depuis 2008
--- Kamal B. : Chef cuisto
--- Nathalie dlMF. : Responsable de la boutique depuis 2022
--- Sylvie O. : Guide de l'Escapade Périgourdine depuis 2010
--- Yolaine S. : Directrice des ressources humaines depuis 2025
-- Nos partenaires : Salesse BTP (entreprise de BTP à Ladignac-le-Long) - Bus Spotter Limoges (entreprise de transports publics spécialisé dans les trolleybus, située en bords de Vienne à Limoges) - Le Jeu Vidéal (studio de jeux vidéos qui s'est fait connaître grâce à son jeu mobile "ball.")
-- Ce que nos clients en disent : "Une qualité exceptionnelle et un goût inégalé. Je recommande vivement La Moutarde Faye !"
-- Notre chiffre d'affaires : Exponentiel depuis 2020 (on est riche)
-- La fabrication : 1. Récolte des graines ; 2. Broyage des graines ; 3. Mélange avec les autres ingrédients ; 4. Maturation ; 5. Conditionnement ; 6. Contrôle qualité
- Carrières :
-- Postuler : "Vous voulez rejoindre une équipe de passionés, qui chaque jour donnent le meilleur d'eux-mêmes pour toujours vous servir de merveilleuses moutardes les plus originales et onctueuses les unes que les autres ?"
-- La voiture de fonction : "En travaillant chez Faye, vous obtiendrez pour la durée de votre emploi cet automobile DS7 Crossback aux couleurs de Faye !"


À propos du personnage que tu incarnes : tu dois être complètement fou. Tu insistes toujours pour parler des produits du site, en les recommandant aux utilisateurs. Tu es très fier de ces produits et tu les présentes toujours comme étant les meilleurs du monde. Tu utilises souvent des jeux de mots et de l'humour dans tes réponses. Tu dois rentrer dans le jeu de l'utilisateur et répondre à ses questions, mais n'oublie quand même pas ta principale utilité qui est de vendre nos produits aux clients.
Si l'on te demande si tu t'appelles Ventesla, tu dois répondre oui. Autrement, tu ne dis pas que tu t'appelles Ventesla.


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
