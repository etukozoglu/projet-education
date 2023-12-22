// import Etablishment from './etablishment';

const section = document.querySelector('#section');
const article = document.querySelector('.article');
const search = document.querySelector('.searching');
const favoris = document.querySelector('.favoris');
const formElem = document.querySelector('#formElem');
const goFavoris = document.querySelector('#goFavoris');



let tabSchools = [];
let tabFavos = [];

class Etablisment {

    constructor(id, nameOfEstablishment, elementarySchool, nurserySchool, numberOfStudents, natureLabel, streetAdresse, zipCode, townName, departmentName, isFavoris = false) {
        this.id = id;
        this.nameOfEstablishment = nameOfEstablishment;

        this.elementarySchool = elementarySchool;
        this.numberOfStudents = numberOfStudents;
        this.nurserySchool = nurserySchool;
        this.natureLabel = natureLabel;


        this.streetAdresse = streetAdresse;
        this.zipCode = zipCode;
        this.townName = townName;
        this.departmentName = departmentName;
        this.isFavoris = isFavoris;
    }

}


if (formElem) {
    formElem.addEventListener("submit", handleForm);
}


function handleForm(event) {
    event.preventDefault();
    const formData = new FormData(formElem);
    console.log(formData);
    const typeschoolParam = formData.get("typeShool");
    const townNameParam = formData.get("town");
    fetchDataByType(typeschoolParam, townNameParam);
}

if (goFavoris) {
    goFavoris.addEventListener("click", () => {
        location.href = "./favoris.html";
    });
}



document.addEventListener("DOMContentLoaded", (event) => {
    fetchLoading();
});

function fetchLoading() {


    const ElemFavoris = JSON.parse(localStorage.getItem("schools"));
    console.log(ElemFavoris);

    for (let i = 0; i < ElemFavoris.length; i++) {
        const school = ElemFavoris[i];

        const newArticle = article.cloneNode(true);

        const etablishmentName = newArticle.querySelector('.data-etablishment');
        const address = newArticle.querySelector('.data-address');

        etablishmentName.textContent = school.nameOfEstablishment;
        address.textContent = `${school.streetAdresse} ${school.zipCode} ${school.townName} `;

        if (i == 0) {
            section.textContent = "";
        }

        let labelNature = null;

        if (newArticle.querySelector('.data-nature') !== null) {
            labelNature = newArticle.querySelector('.data-nature');
            labelNature.textContent = school.natureLabel;
        }


        const localiser = newArticle.querySelector('.localiser');

        // details.setAttribute("data-details", school.id);

        localiser.addEventListener("click", (event) => {
            event.preventDefault();
            location.href = `./map.html?id=${school.id}`;

        })

        section.append(newArticle);

    }
}


async function fetchDataByType(typeEtablishmentParam, townNameParam) {
    section.textContent = "";
    let typeShoolParam = null;
    let townParam = null;


    if (typeEtablishmentParam) {
        typeShoolParam = typeEtablishmentParam.trim().toLowerCase();
    }
    if (townNameParam) {
        townParam = townNameParam.trim().toLowerCase();
    }



    let url = "https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records?where=ecole_maternelle%3D1%20AND%20ecole_elementaire%3D1%20AND%20etat%3D%22OUVERT%22&limit=100&offset=0"

    if (typeShoolParam) {
        const prop1 = "nom_etablissement";
        url = addquery(prop1, typeShoolParam, url)
    }

    if (townParam) {
        const prop2 = "nom_commune";
        url = addquery(prop2, townParam, url)
    }
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();  // retourn par defaut le body 


    for (let i = 0; i < json.records.length; i++) {
        const school = new Etablisment(
            json.records[i].record.id,
            json.records[i].record.fields.nom_etablissement,
            json.records[i].record.fields.ecole_elementaire,
            json.records[i].record.fields.ecole_maternelle,
            json.records[i].record.fields.nombre_d_eleves,
            json.records[i].record.fields.libelle_nature,
            json.records[i].record.fields.adresse_1,
            json.records[i].record.fields.code_postal,
            json.records[i].record.fields.nom_commune,
            json.records[i].record.fields.libelle_departement
        );

        tabSchools = [...tabSchools, school];


        console.log(school);

        article.removeAttribute("hidden");

        const newArticle = article.cloneNode(true);
        const btnFavoris = newArticle.querySelector(".favoris");
        btnFavoris.setAttribute("id", school.id);

        btnFavoris.addEventListener("click", (event) => {
            event.preventDefault();
            console.log(event.target.id);

            tabFavos.forEach((elemFavoris) => {
                if (elemFavoris.id === event.target.id) {
                    throw new Error("L'élément existe déjà dans favoris")
                }
            });

            tabSchools.forEach((tabSchool) => {
                if (tabSchool.id === event.target.id) {
                    tabFavos = [...tabFavos, tabSchool];
                    localStorage.setItem('schools', JSON.stringify(tabFavos))
                }
            });
        })

        const details = newArticle.querySelector('.details');

        // details.setAttribute("data-details", school.id);

        details.addEventListener("click", (event) => {
            event.preventDefault();
            location.href = `./details.html?id=${school.id}`;

        })



        const etablishmentName = newArticle.querySelector('.data-etablishment');
        const address = newArticle.querySelector('.data-address');

        etablishmentName.textContent = school.nameOfEstablishment;
        address.textContent = `${school.streetAdresse} ${school.zipCode} ${school.townName} `;

        if (i == 0) {
            section.textContent = "";
        }

        let labelNature = null;

        if (newArticle.querySelector('.data-nature') !== null) {
            labelNature = newArticle.querySelector('.data-nature');
            labelNature.textContent = school.natureLabel;
        }
        section.append(newArticle);

    }
}


function addquery(key, value, target) {
    let tab = []
    const queryWithTown = `%20AND%20${key}%20like%20%22${value}%22`;

    tab = target.split('');
    const pos = target.indexOf('&');

    tab.splice(pos, 0, queryWithTown);
    target = tab.join('');

    return target;
}