//------------------------------- CONFIRMATION DE LA COMMANDE -----------------------------------

//Récupération de l'id de commande dans l'url : '?orderId=....'
const queryUrlOrderId = window.location.search;
console.log("queryUrlOrderId = ", queryUrlOrderId);

//Extraction de l'id de commande depuis l'url, en enlevant '?orderId='
const urlSearchParams = new URLSearchParams(queryUrlOrderId);
console.log("urlSearchParams = ", urlSearchParams);
const orderId = urlSearchParams.get("orderId");
console.log('orderId =', orderId);


function afficherNumCde() {
    //Vérification de requête à l'API
    fetch("http://localhost:3000/api/products/order" + orderId)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function() { //Affichage numéro de commande dans le DOM
            let orderIdSpan = document.getElementById("orderId");
            orderIdSpan.textContent = orderId;
        })
}

afficherNumCde();