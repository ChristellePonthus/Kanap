//récupération id
const queryUrlId = window.location.search;
console.log('id = ', queryUrlId);

//extraction id
const urlSearchParams = new URLSearchParams(queryUrlId);
console.log(urlSearchParams);

const id = urlSearchParams.get("id");
console.log('id = ', id);

//affichage du produit
// let response = fetch("http://localhost:3000/api/products/" + id);
// console.log(response);

function afficherProduit() {
    fetch("http://localhost:3000/api/products/" + id)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        })
        .then(function(Product) {
            console.log(Product);
            document.getElementsByClassName('item__img')[0]
                .innerHTML = '<img src="' + Product.imageUrl + '" alt="' + Product.altTxt + '">';
            document.getElementById("title")
                .innerHTML = Product.name;
            document.getElementById("price")
                .innerHTML = Product.price;
            document.getElementById("description")
                .innerHTML = Product.description;
            for (const color of Product.colors) {
                console.log(color);
                document.getElementById("colors")
                    .innerHTML += '<option value="' + color + '">' + color + '</option>'
            }
        })
}

afficherProduit();