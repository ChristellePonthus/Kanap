//------------------------------- AFFICHAGE DES DETAILS DU PRODUIT -----------------------------------

//Récupération de l'id du produit dans l'url : '?id=....'
const queryUrlId = window.location.search;

//Extraction de l'id du produit depuis l'url, en enlevant '?id='
const urlSearchParams = new URLSearchParams(queryUrlId);
const id = urlSearchParams.get("id");
console.log('id =', id);

//Affichage du produit
function afficherProduit() {
    fetch("http://localhost:3000/api/products/" + id)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (Product) {

            //Photo du produit
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


//--------------------------------------- AJOUT AU PANIER --------------------------------------------
//-------Récupération des données et envoi au panier au click sur le bouton 'Ajouter au panier'-------

const addToCartBtn = document.querySelector("#addToCart");

addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();

    //Récupération de la couleur et de la quantité choisies
    const colorChoice = document.querySelector("#colors").value;
    const quantityChoice = document.querySelector("#quantity").value;
    //Construction de l'objet qui sera envoyé dans le localStorage
    let productData = {
        _id: id,
        localStorageId: id + colorChoice,
        quantity: quantityChoice,
        color: colorChoice
    }
    console.log("productData", productData);

    //Vérification que la quantité et la couleur sont bien renseignées
    if (quantityChoice != 0 && colorChoice != '') {

        //Envoi des données du produit dans le localStorage
        let recProduct = JSON.parse(localStorage.getItem("produit"));

        //Popup de confirmation d'ajout du produit au panier
        const popupConfirmation = () => {
            if (window.confirm(`${id} option: ${colorChoice} a bien été ajouté au panier.
        Consulter le panier OK ou continuer les achats ANNULER`)) {
                window.location.href = "cart.html";
            } else {
                window.location.href = "index.html";
            }
        }

        //Définition de la clé permettant de classer les produits par id + couleur choisie
        let localStorageId = id + colorChoice;

        //Ajout des produits dans le localStorage
        const ajoutPdt = (localStorageId, quantityChoice) => {
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
            ajoutPdt(localStorageId, quantityChoice);
            popupConfirmation();
        } else {
            //Sinon, création du tableau de produits
            recProduct = [];
            //Et ajout des nouveaux produits
            ajoutPdt(localStorageId, quantityChoice);
            popupConfirmation();
        }
    }
    //Si la couleur et/ou la quantité ne sont pas renseignées correctement
    else if (quantityChoice == 0 && colorChoice == '') {
        alert("Veuillez choisir une quantité et une couleur");
    } else if (quantityChoice == 0) {
        alert("Veuillez choisir une quantité");
    } else if (quantityChoice > 100) {
        alert("Veuillez choisir une quantité comprise entre 1 et 100");
    } else if (colorChoice == '') {
        alert("Veuillez choisir une couleur");
    }
});