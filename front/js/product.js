//----------------------------------- AFFICHAGE DES DETAILS DU PRODUIT SELECTIONNE -----------------------------------

//Récupération de l'id du produit dans l'url : '?id=....'
const queryUrlId = window.location.search;

//Extraction de l'id du produit depuis l'url, en enlevant '?id='
const urlSearchParams = new URLSearchParams(queryUrlId);
const id = urlSearchParams.get("id");

//Création d'une variable permettant d'afficher le nom du produit dans le message de confirmation d'ajout au panier
let prodName;

//Affichage du produit
function displayProduct() {
    fetch("http://localhost:3000/api/products/" + id)
        //Vérification de la connexion à l'API
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        //Récupération des données de la fiche produit pour l'affichage
        .then(function (Product) {

            //Photo du produit
            let productImg = document.createElement("img");
            productImg.src = Product.imageUrl;
            productImg.alt = Product.altTxt;
            document.querySelector("section.item > article > div.item__img").appendChild(productImg);

            //Nom du produit
            let productName = document.getElementById("title");
            productName.textContent = Product.name;
            prodName = Product.name;

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

displayProduct();


//--------------------------------------- AJOUT AU PANIER --------------------------------------------
//-------Récupération des données et envoi au panier au click sur le bouton 'Ajouter au panier'-------

//Ciblage du bouton 'Ajouter au panier'
const addToCartBtn = document.querySelector("#addToCart");

//Fonction d'ajout au panier au clic du bouton
addToCartBtn.addEventListener("click", (event) => {

    //Récupération de la couleur et de la quantité choisies
    const colorChoice = document.querySelector("#colors").value;
    const quantityChoice = document.querySelector("#quantity").value;

    //Définition d'une clé permettant de classer les produits par id + couleur choisie
    let localStorageId = id + colorChoice;

    //Construction de l'objet qui sera envoyé dans le localStorage
    let productData = {
        _id: id,
        localStorageId: id + colorChoice,
        quantity: quantityChoice,
        color: colorChoice
    }

    //Vérification que la quantité et la couleur sont correctement renseignées
    if (/^[0-9\-s]{1,3}$/.test(quantityChoice) && quantityChoice < 101 && quantityChoice != 0 && colorChoice != '') {

        //Envoi des données du produit dans le localStorage si ok
        let recProduct = JSON.parse(localStorage.getItem("produit"));

        //Popup de confirmation d'ajout du produit au panier
        const confirmAddToCart = () => {
            if (window.confirm(`Le produit ${prodName} option: ${colorChoice} a bien été ajouté au panier.\nConsulter le panier OK ou continuer les achats ANNULER`)) {
                window.location.href = "cart.html";
            } else {
                window.location.href = "index.html";
            }
        }

        //Ajout des produits dans le localStorage
        const addToCart = (localStorageId, quantityChoice) => {
            let quantityCheck = false;
            for (let i = 0; i < recProduct.length; i++) {
                //Si le produit a déjà été ajouté avec la même couleur
                if (localStorageId == recProduct[i].localStorageId) {
                    //Récupération de la quantité déjà enregistrée
                    let quantity = parseInt(recProduct[i].quantity);
                    //Ajout de la nouvelle quantité
                    quantity += parseInt(quantityChoice);
                    recProduct[i].quantity = quantity;
                    quantityCheck = true;
                }
            } //Sinon, une nouvelle entrée est ajoutée pour le produit
            if (!quantityCheck) {
                recProduct.push(productData);
            }
            //Enregistrement des produits dans le localStorage
            localStorage.setItem("produit", JSON.stringify(recProduct));
        };

        //S'il y a déjà des produits
        if (recProduct) {
            //Ajout des nouveaux produits
            addToCart(localStorageId, quantityChoice);
            confirmAddToCart();
        } else {
            //Sinon, création du tableau de produits
            recProduct = [];
            //Et ajout des nouveaux produits
            addToCart(localStorageId, quantityChoice);
            confirmAddToCart();
        }
    }
    //Si la couleur et/ou la quantité ne sont pas renseignées correctement
    else if (quantityChoice == 0 && colorChoice == '') {
        alert("Veuillez choisir une quantité et une couleur");
    } else if (quantityChoice == 0) {
        alert("Veuillez choisir une quantité");
    } else if (quantityChoice > 100 || !(/^[0-9\-s]{1,3}$/.test(quantityChoice))) {
        alert("Veuillez choisir une quantité comprise entre 1 et 100");
    } else if (colorChoice == '') {
        alert("Veuillez choisir une couleur");
    }
});