async function loadProductsByCategory() {
  try {
    const response = await fetch('../misc/products.json'); // Récupérer le fichier JSON
    const products = await response.json(); // Transformer en JSON


    products.forEach(product => {
      var container = document.getElementById(`${product.category}-products-container`); // Récupérer le container de la catégorie
      const productDiv = document.createElement('div'); // Crée une élément div
      productDiv.classList.add('product'); // Ajoute la classe "product" à la div créée

      productDiv.innerHTML = `
        <a href="product.html?id=${product.id}"><img class="img" src="../images/produits/${product.img}" alt="${product.title}"></a>
        <a class="title" href="product.html?id=${product.id}">${product.title}</a>
        <p class="price">${product.price}</p>
      `; // Génère ce texte HTML à l'intérieur de la div


      container.appendChild(productDiv); // Ajoute la div dans le container de la catégorie
    });
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error); // Erreur
  }
}

async function loadPopularProducts()
{
  try {
    const response = await fetch('../misc/products.json'); // Récupérer le fichier JSON
    const products = await response.json(); // Transformer en JSON

    const container = document.getElementById('main-products-container'); // Récupérer le container des produits
    container.innerHTML = ""; // Vider le container

    products.forEach(product => {
      if(!product.popular) return; // Ne charger que les produits populaires
      const productDiv = document.createElement('div'); // Créer un élément "div"
      productDiv.classList.add('product'); // Ajouter la classe "product" à la div
      productDiv.innerHTML = `
        <a href="product.html?id=${product.id}"><img class="img" src="../images/produits/${product.img}" alt="${product.title}"></a>
        <a class="title" href="product.html?id=${product.id}">${product.title}</a>
        <p class="price">${product.price}</p>
      `; // Génère ce texte HTML à l'intérieur de la div

      container.appendChild(productDiv); // Ajoute la div dans le container de la catégorie
    });
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error); // Erreur
  }
}