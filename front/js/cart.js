let recProduct = JSON.parse(localStorage.getItem("produit"));
console.log("recProduct ", recProduct);
let deleteItem = '';

if (recProduct === null || recProduct == 0) {
    document.getElementById("cart__items")
        .innerHTML = '<div class="cart__item__content__description">'
        + '<h2>Votre panier est vide !</h2>'
        + '</div>';
} else {
    for (let i = 0; i < recProduct.length; i++) {
        console.log(i, recProduct[i]._id, recProduct[i].color, recProduct[i].quantity);
        console.log("id ", recProduct[i]._id);
        if (recProduct.indexOf(recProduct[i]._id) === -1) {
            function afficherProduit() {
                fetch("http://localhost:3000/api/products/" + recProduct[i]._id)
                    .then(function (response) {
                        if (response.ok) {
                            console.log("response ", response);
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
                        const els = document.querySelector('.deleteItem');
                        console.log("els ", els);
                        deleteItem = els.closest('p');
                        console.log("deleteItem ", i, deleteItem);
                    })
            }
            afficherProduit();
        } else {
            console.log("id existant", recProduct[i]._id);
        }
    }
}

function supprimerProduit() {
    for (let j = 0; j < deleteItem; j++) {
        console.log("deleteItem for ", deleteItem);
        deleteItem[j].addEventListener("click", (event) => {
            event.preventDefault();
            let idDeletedItem = recProduct[j]._id;
            console.log("idDeletedItem ", idDeletedItem);
    
            recProduct = recProduct.filter(el => el._id != idDeletedItem);
            console.log("recProduct ", recProduct);
    
            localStorage.setItem(
                "produit",
                JSON.stringify(recProduct)
            );
            //alerte produit supprimé
            alert("produit supprimé");
            window.location.href = "panier.html";
        });
    }
}
supprimerProduit();