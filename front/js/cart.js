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
                    document.getElementById("cart__items")
                        .innerHTML += '<article class="cart__item" data-id="' + Product._id + '" data-color="' + recProduct.color + '">'
                        + '<div class="cart__item__img">'
                        + '<img src="' + Product.imageUrl + '" alt="' + Product.altTxt + '">'
                        + '</div>'
                        + '<div class="cart__item__content">'
                        + '<div class="cart__item__content__description">'
                        + '<h2>' + Product.name + '</h2>'
                        + '<p>' + recProduct[i].color + '</p>'
                        + '<p>' + Product.price + ' €</p>'
                        + '</div>'
                        + '<div class="cart__item__content__settings">'
                        + '<div class="cart__item__content__settings__quantity">'
                        + '<p>Qté : </p>'
                        + '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + recProduct[i].quantity + '">'
                        + '</div>'
                        + '<div class="cart__item__content__settings__delete">'
                        + '<p class="deleteItem">Supprimer</p>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</article>';

                    deleteItem = document.getElementsByClassName("deleteItem");
                    supprimerProduit(deleteItem);

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

function supprimerProduit(deleteItem) {
    console.log("deleteItem tab", deleteItem);
    for (let j = 0; j < deleteItem.length; j++) {
        console.log("j", j);
        deleteItem[j].addEventListener("click", (event) => {
            event.preventDefault();
            let idDeletedItem = recProduct[j].localStorageId;
            console.log("j 2", j);

            console.log("recProduct[j]._id", recProduct[j].localStorageId);
            localStorage.removeItem(recProduct[j].localStorageId);
            // recProduct = recProduct[j].remove(el => el._id != idDeletedItem);
            console.log("recProduct ", recProduct);

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