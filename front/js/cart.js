//------------------------------------ PANIER -----------------------------------
//---------------------- Récupération des articles sélectionnés -----------------

//Récupération des données du localStorage au format Objet
let recProducts = JSON.parse(localStorage.getItem("produit"));


//Tableau pour récupérer le prix de chaque produit afin de calculer le total du panier
let panier = [];
//Variable pour récupérer les emplacements de chaque input de quantité dans le panier
let quantitySet = '';

//Si le panier est vide
if (recProducts === null || recProducts == 0) {
    //Création d'un titre indiquant que le panier est vide
    let emptyCart = document.createElement("h2");
    emptyCart.textContent = "Votre panier est vide !";
    let divCart = document.getElementById("cart__items");
    divCart.appendChild(emptyCart);
}
//Si le panier contient des articles
else {
    //Tri des articles par id
    recProducts.sort((a, b) => a._id.localeCompare(b._id));
    for (let i = 0; i < recProducts.length; i++) {
        function displayProduct() {
            fetch("http://localhost:3000/api/products/" + recProducts[i]._id)
                //Vérification de la connexion à l'API
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })
                //Récupération des données de la fiche produit pour l'affichage
                .then(function (Product) {

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

                    //Enregistrement de chaque produit dans le tableau "panier"
                    panier.push(Product);

                    //Définition de la clé permettant de cibler la ligne du produit dans le panier
                    let localStorageId = recProducts[i]._id + recProducts[i].color;

                    //Récupération du lien pour la suppression
                    let deleteItem = document.getElementsByClassName("deleteItem");
                    //Suppression au click sur le lien
                    deleteItem[i].addEventListener("click", (event) => {
                        deleting(localStorageId);
                    });

                    //Récupération de la quantité de l'article
                    let productQuantity = parseInt(recProducts[i].quantity);
                    //Récupération de l'emplacement de la quantité dans le DOM
                    quantitySet = document.getElementsByClassName("itemQuantity");

                    //Mise à jour de la quantit de l'article si modification par l'utilisateur
                    updateQuantity(panier, productQuantity, localStorageId);

                    //Affichage 
                    displayTotal(panier);
                })
        }
        displayProduct();
    }
}

//-------------------------------- TOTAL DU PANIER ---------------------------------------

//Déclaration des tableaux dans lesquels seront insérés la quantité ainsi que le prix total de chaque article

function displayTotal(panier) {

    //Récupération de l'emplacement du DOM où seront affichés les totaux de la quantité et du prix du panier
    let totalQuantity = document.querySelector('#totalQuantity').closest('span');
    let totalPrice = document.querySelector('#totalPrice').closest('span');

    let cumulQtty = 0;
    let cumulPrice = 0;
    for (let i = 0; i < panier.length; i++) {
        for (let j = 0; j < recProducts.length; j++) {
            if ((recProducts[j]._id == panier[i]._id)) {
                cumulQtty += parseInt(recProducts[j].quantity);
                cumulPrice += (parseInt(panier[i].price) * parseInt(recProducts[j].quantity));
            }
        }
    }

    //Affichage de la quantité totale dans le DOM
    totalQuantity.textContent = cumulQtty;

    //Affichage du prix total dans le DOM
    totalPrice.textContent = cumulPrice;
}


//Fonction de suppression du produit appelée lors du clic sur le lien "Supprimer"
//ou quand la quantité est mise à 0
function deleting(localStorageId) {
    for (let i = 0; i < recProducts.length; i++) {
        if (localStorageId == recProducts[i].localStorageId) {
            recProducts.splice(i, 1);
            localStorage.setItem("produit", JSON.stringify(recProducts));
            //alerte produit supprimé
            alert("produit supprimé");
            window.location.href = "cart.html";
        }
    }
}


//Mis à jour de la quantité du produit dans le localStorage si modification par l'utilisateur
function updateQuantity(panier, productQuantity, localStorageId) {
    for (let i = 0; i < quantitySet.length; i++) {
        quantitySet[i].addEventListener("change", function (event) {
            const newQtty = event.target.value;
            //Vérification que la case ne contient que des chiffres, compris entre 1 et 100
            if (/^[0-9\-s]{1,3}$/.test(newQtty) && (newQtty < 101) && (newQtty != 0)) {
                if (productQuantity !== newQtty) {
                    recProducts[i].quantity = newQtty;
                    localStorage.setItem("produit", JSON.stringify(recProducts));
                    // window.location.href = "cart.html";
                    displayTotal(panier);
                }
            } else if (newQtty == 0) { //Si la quantité est mise à 0, le produit est supprimé
                deleting(localStorageId);
            } else {
                alert("Veuillez renseigner une quantité correcte comprise entre 1 et 100");
            }
        });
    }
}



//------------------------------------ FORMULAIRE -----------------------------------
//-------- Récupération et validation des données du formulaire avant envoi ---------

//Bouton 'Commander !'
const submitBtn = document.querySelector("#order");

//Au click du bouton :
submitBtn.addEventListener("click", async (e) => {

    //Récupération des valeurs entrées dans chaque champ
    const contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value
    };

    //Envoi de l'objet "contact" dans le localStorage pour pouvoir garder les données
    //et ne pas tout resaisir s'il y a une erreur (fonction keepDataInForm(input) plus bas)
    localStorage.setItem("contact", JSON.stringify(contact));

    //Création du tableau contenant les id des produits
    let products = [];
    for (let i = 0; i < recProducts.length; i++) {
        products.push(recProducts[i]._id);
    }

    //Objet contenant les données du formulaire et les produits sélectionnés
    const commande = {
        contact,
        products
    }

    //Fonction de validation du champ 'Email'
    function emailCtrl() {
        email = contact.email.toString();
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
    };

    //Fonction de validation du champ 'Adresse'
    function addressCtrl() {
        address = contact.address.toString();
        if (/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 '-]{5,50}$/.test(address)) {
            return true;
        }
    };

    //Fonction de validation pour les champs 'Prénom', 'Nom', 'Ville'
    function ctrlNames(name) {
        if (/^[A-Za-zÀ-ÖØ-öø-ÿ '-]{3,20}$/.test(name)) {
            return true;
        }
    }
    //Récupération de la donnée du champ 'Prénom' au format String pour validation
    firstName = contact.firstName.toString();

    //Récupération de la donnée du champ 'Nom' au format String pour validation
    lastName = contact.lastName.toString();

    //Récupération de la donnée du champ 'Ville' au format String pour validation
    city = contact.city.toString();

    //Contrôle avant envoi des données dans le localStorage
    if (ctrlNames(firstName) && ctrlNames(lastName) && ctrlNames(city) && emailCtrl() && addressCtrl()) {

        //Si tout est ok, envoi de l'objet 'commande' vers le serveur
        //Requête à l'API
        const requestAPI = fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(commande),
            headers: {
                "Content-Type": "application/json",
            },
        });

        //Récupération de la réponse de l'API
        requestAPI.then(async (response) => {
            try {
                const content = await response.json();
                if (response.ok) {
                    //Suppression des données du localStorage
                    localStorage.clear();
                } else {
                    console.log("erreur");
                }
                //Redirection vers la page de confirmation
                window.location.href = "confirmation.html?orderId=" + content.orderId;
            } catch (e) {
                console.log(e);
            }
        })
    } else {
        //Si le formulaire n'est pas rempli correctement, des messages d'erreur s'affichent sous les champs concernés
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

    e.preventDefault();

});


//------------------- Maintien des données de saisie dans le formulaire ------------------

//Récupération des données de saisie du formulaire dans le localStorage
const formValues = localStorage.getItem("contact");

//Conversion en objet javascript
const formValuesObjet = JSON.parse(formValues);

//Fonction remplissant les champs du formulaire par les données du localStorage, si existantes
function keepDataInForm(input) {
    if (formValuesObjet != null) {
        document.querySelector(`#${input}`).value = formValuesObjet[input];
    }
}

//Appel des fonctions
keepDataInForm("firstName");
keepDataInForm("lastName");
keepDataInForm("address");
keepDataInForm("city");
keepDataInForm("email");