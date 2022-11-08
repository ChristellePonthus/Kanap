function afficherProduits() {
    fetch("http://localhost:3000/api/products")
        .then(function(response) {
            if (response.ok) {
                console.log("response = ", response);
                return response.json();
            }
        })
        .then(function(Product) {
            console.log(Product);
            for (const product of Product) {
                console.log(product);
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

var str = "https://waytolearnx.com/t.html?name=alex-babtise&age=25&address=paris";
var url = new URL(str);
var pUrl = url.searchParams.get("pUrl");
console.log("pUrl = ", pUrl);