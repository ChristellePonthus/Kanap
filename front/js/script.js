function afficherProduits() {
    fetch("http://localhost:3000/api/products")
        .then(function(response) {
            if (response.ok) {
                console.log("DB ok");
                return response.json();
            }
        })
        .then(function(Product) {
            let itemSection = document.getElementById("items");
            for (const product of Product) {

                //Photo du produit
                let productImg = document.createElement("img");
                productImg.src = product.imageUrl;
                productImg.alt = product.altTxt;

                //Nom du produit
                let productName = document.createElement("h3");
                productName.textContent = product.name;

                //Description du produit
                let productDesc = document.createElement("p");
                productDesc.textContent = product.description;

                //Prix du produit
                let productPrice = document.createElement("p");
                productPrice.textContent = product.price + " €";

                //Balise 'article' contenant les éléments
                let productArticle = document.createElement("article");
                productArticle.appendChild(productImg);
                productArticle.appendChild(productName);
                productArticle.appendChild(productDesc);
                productArticle.appendChild(productPrice);
                console.log("productArticle", productArticle);

                //Balise 'a href' pour le lien vers la fiche produit
                let productLink = document.createElement("a");
                productLink.href = './product.html?id=' + product._id;
                productLink.appendChild(productArticle);

                //Insertion des éléments dans la section 'items'
                itemSection.appendChild(productLink);
            }
        })
        .catch(function(err) {
            console.error("Erreur");
        });
}

afficherProduits();