//récupération id
const queryUrlId = window.location.search;
console.log('id = ', queryUrlId);

//extraction id
const urlSearchParams = new URLSearchParams(queryUrlId);

const id = urlSearchParams.get("id");
console.log('id = ', id);

//affichage du produit

function afficherProduit() {
    fetch("http://localhost:3000/api/products/" + id)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(Product) {
            document.getElementsByClassName('item__img')[0]
                .innerHTML = '<img src="' + Product.imageUrl + '" alt="' + Product.altTxt + '">';
            document.getElementById("title")
                .innerHTML = Product.name;
            document.getElementById("price")
                .innerHTML = Product.price;
            document.getElementById("description")
                .innerHTML = Product.description;
            for (const color of Product.colors) {
                document.getElementById("colors")
                    .innerHTML += '<option value="' + color + '">' + color + '</option>'
            }
        })
}

afficherProduit();


// Récupération des données et envoi au panier

const btn_send = document.querySelector("#addToCart");

btn_send.addEventListener("click", (event) =>{
    event.preventDefault();
    const colorChoice = document.querySelector("#colors").value;
    const quantityChoice = document.querySelector("#quantity").value;
    let productData = {
        _id: id,
        quantity: quantityChoice,
        color: colorChoice
    }
    console.log(productData);

    //Local storage
    let recProduct = JSON.parse(localStorage.getItem("produit"));
    console.log(recProduct);

    //Popup

    const popupConfirmation = () => {
        if (window.confirm(`${id} option: ${colorChoice} a bien été ajouté au panier.
        Consulter le panier OK ou continuer les achats ANNULER`)) {
            window.location.href = "cart.html";
        } else {
            window.location.href = "index.html";
        }
    }

    //fonction ajouter produits
    const ajoutPdt = () => {
        recProduct.push(productData);
        localStorage.setItem("produit", JSON.stringify(recProduct));
    };

    //s'il y a déjà des produits
    if (recProduct) {
        ajoutPdt();
        popupConfirmation();
    } else {
        recProduct = [];
        ajoutPdt();
        popupConfirmation();
    }
});