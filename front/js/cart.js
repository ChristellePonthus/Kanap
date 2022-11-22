//Récupération des articles sélectionnés
let recProduct = JSON.parse(localStorage.getItem("produit"));
console.log("recProduct 1", recProduct);

let deleteItem = '';
let totalQuantity = 0;
let totalPrice = 0;

if (recProduct === null || recProduct == 0) {
    document.getElementById("cart__items")
        .innerHTML = '<div class="empty_cart">'
        + '<h2>Votre panier est vide !</h2>'
        + '</div>';
} else {
    //Tri des articles par id
    recProduct.sort((a, b) => a._id.localeCompare(b._id));
    for (let i = 0; i < recProduct.length; i++) {
        function afficherProduit() {
            fetch("http://localhost:3000/api/products/" + recProduct[i]._id)
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
                    colorChoice.textContent = recProduct[i].color;

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
                    quantitySetting.value = recProduct[i].quantity;
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
                    productArticle.dataset.id = recProduct[i]._id;
                    productArticle.dataset.color = recProduct[i].color;
                    productArticle.appendChild(divProductImg);
                    productArticle.appendChild(divCartItemContent);

                    //Insertion dans la section 'cart__items'
                    cartSection.appendChild(productArticle);

                    let localStorageId = recProduct[i]._id + recProduct[i].color;

                    deleteItem = document.getElementsByClassName("deleteItem");
                    supprimerProduit(localStorageId);

                    //Cumul quantité
                    totalQuantity = document.getElementById('totalQuantity')
                        .innerHTML = totalQuantity += parseInt(recProduct[i].quantity);

                    //Cumul prix
                    totalPrice = document.getElementById('totalPrice')
                        .innerHTML = totalPrice += parseInt(recProduct[i].quantity) * Product.price;
                })
        }
        afficherProduit();
    }
}

function supprimerProduit(localStorageId) {

    for (let j = 0; j < deleteItem.length; j++) {
        deleteItem[j].addEventListener("click", (event) => {
            for (let i = 0; i < recProduct.length; i++) {
                if (localStorageId == recProduct[i].localStorageId) {
                    console.log("suprimer ?");
                    recProduct.splice(i, 1);
                    localStorage.setItem("produit", JSON.stringify(recProduct));
                }
            }
            event.preventDefault();

            //alerte produit supprimé
            alert("produit supprimé");
            window.location.href = "cart.html";
        });
    }
}



// Validation du formulaire
// document.querySelector('.cart__order__form input[type="submit"]').addEventListener("click", (e) => {
//     e.preventDefault();
//     let validInput = document.querySelectorAll("input");
//     console.log("validInput", validInput);
//     for (let i = 0; i < validInput.length; i++) {
//         const element = validInput[i].closest(".cart__order__form__question");
//         console.log("element",i, element);
//     }
//     document.querySelector('.cart__order__form input[name="firstName"]').reportValidity();
//     document.querySelector('.cart__order__form input[name="lastName"]').reportValidity();
// });

//Récupération données formulaire
// const btnEnvoyer = document.querySelector("#order");
// console.log("btnEnvoyer", btnEnvoyer);
// btnEnvoyer.addEventListener("click", (e) => {
//     e.preventDefault();
//     localStorage.setItem("firstName", document.querySelector("#firstName").value);
//     localStorage.setItem("lastName", document.querySelector("#lastName").value);
//     localStorage.setItem("address", document.querySelector("#address").value);
//     localStorage.setItem("city", document.querySelector("#city").value);
//     localStorage.setItem("email", document.querySelector("#email").value);
// })

// //Mettre les valeurs dans un objet
// const formulaire = {
//     prenom : localStorage.getItem("#firstName"),
//     nom : localStorage.getItem("#lastName"),
//     adresse : localStorage.getItem("#address"),
//     ville : localStorage.getItem("#city"),
//     email : localStorage.getItem("#email")
// }
// console.log(formulaire);