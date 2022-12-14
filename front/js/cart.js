//------------------------------------ PANIER -----------------------------------
//---------------------- Récupération des articles sélectionnés -----------------

let recProducts = JSON.parse(localStorage.getItem("produit"));
console.log("products 1", recProducts);

let deleteItem = '';
let quantitySet = '';
let cumulQtty = 0;
let totalQuantity = 0;
let qttyTab = [];
let priceTab = [];
let totalPriceProduct = 0;
let totalPrice = 0;
let cumulPrice = 0;

//Si le panier est vide
if (recProducts === null || recProducts == 0) {
    let emptyCart = document.createElement("h2");
    emptyCart.textContent = "Votre panier est vide !";
    let divCart = document.getElementById("cart__items");
    divCart.appendChild(emptyCart);
} else {
    //Tri des articles par id
    recProducts.sort((a, b) => a._id.localeCompare(b._id));
    for (let i = 0; i < recProducts.length; i++) {
        function afficherProduit() {
            fetch("http://localhost:3000/api/products/" + recProducts[i]._id)
                .then(function (response) {
                    if (response.ok) {
                        console.log("DB ok");
                        return response.json();
                    }
                })
                .then(function (Product) {
                    console.log("Product ", Product);

                    //Récupération de la section où sera affiché le produit
                    let cartSection = document.getElementById("cart__items");

                    //Affichage de la photo du produit dans une div
                    let productImg = document.createElement("img");
                    productImg.src = Product.imageUrl;
                    productImg.alt = Product.altTxt;
                    let divProductImg = document.createElement("div");
                    divProductImg.classList.add("cart__item__img");
                    divProductImg.appendChild(productImg);

                    //Nom du produit
                    let productName = document.createElement("h2");
                    productName.textContent = Product.name;

                    //Couleur choisie
                    let colorChoice = document.createElement("p");
                    colorChoice.textContent = recProducts[i].color;

                    //Prix du produit
                    let productPrice = document.createElement("p");
                    productPrice.textContent = Product.price + " €";

                    //"div description" contenant le nom, la couleur choisie et le prix
                    let divCartDesc = document.createElement("div");
                    divCartDesc.classList.add("cart__item__content__description");
                    divCartDesc.appendChild(productName);
                    divCartDesc.appendChild(colorChoice);
                    divCartDesc.appendChild(productPrice);


                    //Affichage de la quantité dans une div
                    let quantitySettingName = document.createElement("p");
                    quantitySettingName.textContent = "Qté :";
                    let quantitySetting = document.createElement("input");
                    quantitySetting.type = "number";
                    quantitySetting.classList.add("itemQuantity");
                    quantitySetting.name = "itemQuantity";
                    quantitySetting.min = "1";
                    quantitySetting.max = "100";
                    quantitySetting.value = parseInt(recProducts[i].quantity);
                    let divQuantitySetting = document.createElement("div");
                    divQuantitySetting.classList.add("cart__item__content__settings__quantity");
                    divQuantitySetting.appendChild(quantitySettingName);
                    divQuantitySetting.appendChild(quantitySetting);

                    //Lien pour supprimer l'article
                    let linkDeleteItem = document.createElement("p");
                    linkDeleteItem.classList.add("deleteItem");
                    linkDeleteItem.textContent = "Supprimer";
                    let divLinkDeleteItem = document.createElement("div");
                    divLinkDeleteItem.classList.add("cart__item__content__settings__delete");
                    divLinkDeleteItem.appendChild(linkDeleteItem);

                    //div contenant la quantité et le lien de suppression
                    let divCartItemSettings = document.createElement("div");
                    divCartItemSettings.classList.add("cart__item__content__settings");
                    divCartItemSettings.appendChild(divQuantitySetting);
                    divCartItemSettings.appendChild(divLinkDeleteItem);

                    //div contenant la description et la quantité
                    let divCartItemContent = document.createElement("div");
                    divCartItemContent.classList.add("cart__item__content");
                    divCartItemContent.appendChild(divCartDesc);
                    divCartItemContent.appendChild(divCartItemSettings);

                    //Balise 'article' contenant tous les éléments ci-dessus
                    let productArticle = document.createElement("article");
                    productArticle.classList.add("cart__item");
                    productArticle.dataset.id = recProducts[i]._id;
                    productArticle.dataset.color = recProducts[i].color;
                    productArticle.appendChild(divProductImg);
                    productArticle.appendChild(divCartItemContent);

                    //Insertion dans la section 'cart__items'
                    cartSection.appendChild(productArticle);

                    //Définition de la clé permettant de cibler la ligne du produit dans le panier
                    let localStorageId = recProducts[i]._id + recProducts[i].color;

                    //Récupération du lien pour la suppression
                    deleteItem = document.getElementsByClassName("deleteItem");
                    //Suppression au click sur le lien
                    supprimerProduit(localStorageId);

                    //Récupération de la quantité de l'article
                    let productQuantity = parseInt(recProducts[i].quantity);
                    quantitySet = document.getElementsByClassName("itemQuantity");
                    console.log("quantitySet", quantitySet);
                    console.log("productQuantity", productQuantity, typeof (productQuantity));
                    
                    //Mise à jour de la quantit de l'article si modification par l'utilisateur
                    updateQuantity(Product, productQuantity, localStorageId);

                    //Calcul du prix total de l'article
                    totalPriceProduct = parseInt(productQuantity) * parseInt(Product.price);
                    
                    //Affichage 
                    afficherTotal(Product, productQuantity);
                })
        }
        afficherProduit();
    }
}

//Fonction de suppression du produit appelée lors du clic sur le lien "Supprimer"
//ou quand la quantité est mise à 0
function suppression(localStorageId) {
    for (let i = 0; i < recProducts.length; i++) {
        if (localStorageId == recProducts[i].localStorageId) {
            recProducts.splice(i, 1);
            localStorage.setItem("produit", JSON.stringify(recProducts));
        }
    }
    //alerte produit supprimé
    alert("produit supprimé");
    window.location.href = "cart.html";
}

//Supprimer le produit lors du click sur le lien "Supprimer"
function supprimerProduit(localStorageId) {
    for (let j = 0; j < deleteItem.length; j++) {
        deleteItem[j].addEventListener("click", (event) => {
            suppression(localStorageId);
            event.preventDefault();
        });
    }
}
//Fin fonctions de suppression

//Mis à jour de la quantité du produit dans le localStorage si modification par l'utilisateur
function updateQuantity(Product, productQuantity, localStorageId) {
    for (let i = 0; i < quantitySet.length; i++) {
        quantitySet[i].addEventListener("change", function (event) {
            event.preventDefault();
            const newQtty = event.target.value;
            //Vérification que la case ne contient que des chiffres, compris entre 1 et 100
            if (/^[0-9\-s]{1,3}$/.test(newQtty) && (newQtty < 100) && (newQtty != 0)) {
                console.log("if ?");
                if (recProducts[i].quantity !== newQtty) {
                    recProducts[i].quantity = newQtty;
                    localStorage.setItem("produit", JSON.stringify(recProducts));
                    afficherTotal(Product, productQuantity);
                }
            } else if (newQtty == 0) { //Si la quantité est mise à 0, le produit est supprimé
                console.log("else if ?");
                suppression(localStorageId);
            } else {
                alert("Veuillez renseigner une quantité correcte comprise entre 1 et 100");
            }
        });
    }
}


//Affichage du total d'articles et du prix total du panier
function afficherTotal(Product, productQuantity) {
    console.log("afficherTotal");

    //Récupération des span où seront affichées les informations
    totalQuantity = document.querySelector('#totalQuantity').closest('span');
    totalPrice = document.querySelector('#totalPrice').closest('span');


    qttyTab.push(productQuantity);
    priceTab.push(totalPriceProduct);
    console.log("qttyTab[i]", qttyTab);

    //Méthode .reduce permettant de faire la somme dans les tableaux
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    cumulQtty = qttyTab.reduce(reducer, 0);
    console.log("cumulQtty total", cumulQtty);

    cumulPrice = priceTab.reduce(reducer,0);
    console.log("cumulPrice", cumulPrice);

    console.log("qttyTab afficherTotal", qttyTab);
    console.log("priceTab afficherTotal", priceTab);

    totalQuantity.textContent = cumulQtty;

    // additionner les quantités puis recalculer le prix

    //Affichage de ce prix total dans le DOM
    totalPrice.textContent = cumulPrice;
}


//------------------------------------ FORMULAIRE -----------------------------------
//-------- Récupération et validation des données du formulaire avant envoi ---------

//Bouton 'Commander !'
const submitBtn = document.querySelector("#order");

//Au click du bouton :
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    //Récupération des valeurs entrées dans chaque champs
    const contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value
    };

    //Validation du champ 'Email'
    function emailCtrl() {
        email = contact.email.toString();
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
    };

    //Validation du champ 'Adresse'
    function addressCtrl() {
        address = contact.address.toString();
        if (/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 '-]{5,50}$/.test(address)) {
            return true;
        }
    };

    //fonction de validation pour les champs 'Prénom', 'Nom', 'Ville'
    function ctrlNames(name) {
        if (/^[A-Za-zÀ-ÖØ-öø-ÿ'-]{3,20}$/.test(name)) {
            return true;
        }
    }
    //Récupération de la donnée du champ 'Prénom' pour validation
    firstName = contact.firstName.toString();

    //Récupération de la donnée du champ 'Nom' pour validation
    lastName = contact.lastName.toString();

    //Récupération de la donnée du champ 'Ville' pour validation
    city = contact.city.toString();

    //Contrôle avant envoi des données dans le localStorage
    if (ctrlNames(firstName) && ctrlNames(lastName) && ctrlNames(city) && emailCtrl() && addressCtrl()) {

        //Si tout est ok, envoi de l'objet "contact" dans le localStorage
        localStorage.setItem("contact", JSON.stringify(contact));

        //Création du tableau contenant les id des produits
        let products = [];
        for (let i = 0; i < recProducts.length; i++) {
            products.push(recProducts[i]._id);
        }
        console.log("productsId", products);

        //Objet contenant les données du formulaire et les produits sélectionnés
        const commande = {
            contact,
            products
        }
        console.log("commande", typeof (commande), commande);

        //Envoi de l'objet 'commande' vers le serveur

        //Vérification de requête à l'API
        const promise = fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(commande),
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("promise", promise);

        promise.then(async (response) => {
            try {
                const contenu = await response.json();
                console.log("contenu =", contenu);
                if (response.ok) {
                    console.log("resultat de responde.ok = " + response.ok);
                    console.log("contenu.orderId", contenu.orderId);
                } else {
                    
                }
                window.location.href = "confirmation.html?orderId=" + contenu.orderId;
            } catch (e) {
                console.log(e);
            }
        })
    } else {
        alert("Veuillez remplir correctement le fomulaire !");
        if (!ctrlNames(firstName)) {
            let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
            firstNameErrorMsg.textContent = "Merci de remplir ce champ correctement";
        }
        if (!ctrlNames(lastName)) {
            let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
            lastNameErrorMsg.textContent = "Merci de remplir ce champ correctement";
        }
        if (!ctrlNames(city)) {
            let cityErrorMsg = document.querySelector('#cityErrorMsg');
            cityErrorMsg.textContent = "Merci de remplir ce champ correctement";
        }
        if (!emailCtrl()) {
            let emailErrorMsg = document.querySelector('#emailErrorMsg');
            emailErrorMsg.textContent = "Merci de remplir ce champ correctement";
        }
        if (!addressCtrl()) {
            let addressErrorMsg = document.querySelector('#addressErrorMsg');
            addressErrorMsg.textContent = "Merci de remplir ce champ correctement";
        }
    }


});

