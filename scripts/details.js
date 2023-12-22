// selectionner les différents éléments du DOM
const containerHTML = document.querySelector('.container_etablissement');
const favoris = document.querySelector('.favoris');

if (goFavoris) {
    goFavoris.addEventListener("click", () => {
        location.href = "./favoris.html";
    });
}
// appel API 

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
const getSchoolDAta = function () {
    console.log(id)
    fetch(`https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            return renderData(data);
        })
}
getSchoolDAta();

const renderData = (data) => {
    console.log(data)
    containerHTML.innerHTML = '';
    const interObject = data.record.fields;
    const maternelle = interObject.ecole_maternelle;
    const elementaire = interObject.ecole_elementaire;
    let getElementaireOuMaternelle;
    if (maternelle === 1 && elementaire === 0) {
        getElementaireOuMaternelle = 'Maternelle';
    } else if (maternelle === 0 && elementaire === 1) {
        getElementaireOuMaternelle = 'Élémentaire';
    } else if (maternelle === 1 && elementaire === 1) {
        getElementaireOuMaternelle = 'Polyvalent';
    };
    const getDataField = `
    <div class="item-name-etablissement">${interObject.nom_etablissement}</div>
     <section class="container-display-flex-left">
    <div class="item"> <strong>Statut d'école :</strong> ${interObject.statut_public_prive} </div>
    <div class="item"> <strong>Types d’établissements :</strong> ${getElementaireOuMaternelle} </div>
    <div class="item"> <strong>Arr° :</strong> ${interObject.nom_commune} </div>
    <div class="item"> <strong>Nombre d’élèves :</strong>  ${interObject.nombre_d_eleves === null ? 'Non disponible' : interObject.nombre_d_eleves} </div>
    <div class="item"> <strong>Adresse :</strong> ${interObject.adresse_1}, ${interObject.adresse_3}, ${interObject.libelle_region} </div>
    <div class="item"> <strong>Téléphone :</strong> ${interObject.telephone}</div>
    <div class="item"> <strong>E-mail :</strong> ${interObject.mail}</div>
</section>`;
    containerHTML.insertAdjacentHTML('beforeend', getDataField);

}
///// afficher les données API sur la page Map HTML

containerHTML.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = `./map.html?id=${id}`;

})