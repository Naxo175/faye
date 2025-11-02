async function loadProductsByCategory() {
  try {
    const response = await fetch('../misc/products.json'); // charge le fichier JSON
    const products = await response.json(); // parse en objet JS


    products.forEach(product => {
      var container = document.getElementById(`${product.category}-products-container`);
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      productDiv.innerHTML = `
        <a href="product.html?id=${product.id}"><img class="img" src="../images/produits/${product.img}" alt="${product.title}"></a>
        <a class="title" href="product.html?id=${product.id}">${product.title}</a>
        <p class="price">${product.price}</p>
      `;


      container.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
  }
}

async function loadPopularProducts()
{
  try {
    const response = await fetch('../misc/products.json'); // charge le fichier JSON
    const products = await response.json(); // parse en objet JS

    const container = document.getElementById('main-products-container');
    container.innerHTML = ""; // vide le container avant d'ajouter

    products.forEach(product => {
      if(!product.popular) return; // ne charge que les produits populaires
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
        <a href="product.html?id=${product.id}"><img class="img" src="../images/produits/${product.img}" alt="${product.title}"></a>
        <a class="title" href="product.html?id=${product.id}">${product.title}</a>
        <p class="price">${product.price}</p>
      `;
      container.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
  }
}