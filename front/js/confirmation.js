//------------------------------- CONFIRMATION DE LA COMMANDE -----------------------------------

//Récupération de l'id de commande dans l'url : '?orderId=....'
const queryUrlOrderId = window.location.search;

//Extraction de l'id de commande depuis l'url, en enlevant '?orderId=' grâce à "URLSearchParams"
const urlSearchParams = new URLSearchParams(queryUrlOrderId);
const orderId = urlSearchParams.get("orderId");

//Vérification que le numéro de commande a bien été récupéré
if (orderId != null) {
    //Affichage numéro de commande dans le DOM
    let orderIdSpan = document.getElementById("orderId");
    orderIdSpan.textContent = orderId;
} else {
    alert("Le numéro de commande n'a pas pu être récupéré");
}