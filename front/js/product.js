//récupération id
const queryUrlId = window.location.search;

//extraction id
const urlSearchParams = new URLSearchParams(queryUrlId);

const id = urlSearchParams.get("id");
console.log('id =', id);

//Affichage du produit

function afficherProduit() {
    fetch("http://localhost:3000/api/products/" + id)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(Product) {

            //Photo du produit
            let divProductImg = document.getElementsByClassName("item__img");
            let productImg = document.createElement("img");
            productImg.src = Product.imageUrl;
            productImg.alt = Product.altTxt;
            document.querySelector("section.item > article > div.item__img").appendChild(productImg);

            //Nom du produit
            let productName = document.getElementById("title");
            productName.textContent = Product.name;

            //Prix du produit
            let productPrice = document.getElementById("price");
            productPrice.textContent = Product.price + " €";

            //Description du produit
            let productDesc = document.getElementById("description");
            productDesc.textContent = Product.description;

            //Couleurs du produit
            let colorChoice = document.getElementById("colors");
            for (const color of Product.colors) {
                let optionValue = document.createElement("option");
                optionValue.value = color;
                optionValue.text = color;
                colorChoice.options.add(optionValue);
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
        localStorageId : id + colorChoice,
        quantity: quantityChoice,
        color: colorChoice
    }
    console.log(productData);

    if (quantityChoice != 0 && colorChoice != '') {
        //Local storage
    let recProduct = JSON.parse(localStorage.getItem("produit"));

    //Popup
    const popupConfirmation = () => {
        if (window.confirm(`${id} option: ${colorChoice} a bien été ajouté au panier.
        Consulter le panier OK ou continuer les achats ANNULER`)) {
            window.location.href = "cart.html";
        } else {
            window.location.href = "index.html";
        }
    }

    let localStorageId = id + colorChoice;
    //fonction ajouter produits
    const ajoutPdt = (localStorageId, quantityChoice) => {
        let quantityCheck = false;
        for (let i = 0; i < recProduct.length; i++) {
            if (localStorageId == recProduct[i].localStorageId) {
                console.log("recProduct[i]", recProduct[i]);
                console.log("if ?");
                let quantity = parseInt(recProduct[i].quantity);
                quantity += parseInt(quantityChoice);
                recProduct[i].quantity = quantity;
                console.log("quantity", quantity);
                quantityCheck = true;
            }
        }
        if (!quantityCheck) {
            recProduct.push(productData);
        }
        localStorage.setItem("produit", JSON.stringify(recProduct));
    };

    //s'il y a déjà des produits
    if (recProduct) {
        ajoutPdt(localStorageId, quantityChoice);
        popupConfirmation();
    } else {
        recProduct = [];
        ajoutPdt(localStorageId, quantityChoice);
        popupConfirmation();
    }
    } else if (quantityChoice == 0 && colorChoice == '') {
        alert("Veuillez choisir une quantité et une couleur");
    } else if (quantityChoice == 0) {
        alert("Veuillez choisir une quantité");
    } else if (colorChoice == '') {
        alert("Veuillez choisir une couleur");
    }
});