// selectionner les différents éléments du DOM
const cardList = document.querySelector('.card-list');
const favoris = document.querySelector('.favoris');

if (goFavoris) {
    goFavoris.addEventListener("click", () => {
        location.href = "./favoris.html";
    });
}


// ...

// ...

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
    // cardList.innerHTML = '';
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


    // Ajoutez ces lignes pour récupérer les données de latitude et longitude
    const latitude = interObject.latitude;
    const longitude = interObject.longitude;

    // Mettez à jour l'URL de l'iframe avec les données de latitude et longitude
    const googleMapIframe = document.getElementById('googleMap');

    googleMapIframe.src = `https://www.google.com/maps/embed/v1/view?key=AIzaSyCXH4bZNmIDwYr29j2nJvzzLCTiS2yo4M0&center=${latitude},${longitude}&zoom=15`;



    const getDataField = `
<article class="card">
            <div class="card-header">
                <div class="name-school">
                    <a class="card-title">${interObject.nom_etablissement}</a>
                </div>
            </div>
            <div class="card-meta">
                <div class="school-type">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        display="block" id="SchoolIcon">
                        <rect x="2" y="9" width="20" height="12" />
                        <path d="M12 2L20 9L12 16L4 9L12 2Z" />
                        <circle cx="10" cy="10" r="2" fill="#3498db" />
                        <circle cx="14" cy="10" r="2" fill="#3498db" />
                    </svg>
                    <span class="mini-title">Adresse de l’école : ${interObject.adresse_1}, ${interObject.adresse_3}, ${interObject.libelle_region}</span>
                </div>
            </div>
        </article>
`;

    cardList.insertAdjacentHTML("beforebegin", getDataField);
}