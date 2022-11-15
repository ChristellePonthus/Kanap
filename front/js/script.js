function afficherProduits() {
    fetch("http://localhost:3000/api/products")
        .then(function(response) {
            if (response.ok) {
                console.log("DB ok");
                return response.json();
            }
        })
        .then(function(Product) {
            for (const product of Product) {
                document.getElementById("items")
                    .innerHTML += '<a href="./product.html?id=' + product._id + '">'
                    + '<article>'
                    + '<img src="' + product.imageUrl + '" alt="' + product.altTxt + '">'
                    + '<h3 class="productName">'+ product.name +'</h3>' 
                    + '<p class="productDescription">' + product.description + '</p>'
                    + '<p class="productDescription">' + product.price + '€</p>'
                    + '</article>'
                    + '<a>';
            }
        })
        .catch(function(err) {
            console.error("Erreur");
        });
}

afficherProduits();