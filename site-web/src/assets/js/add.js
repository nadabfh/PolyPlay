// TODO : Récupérer les bons éléments des fichiers externes
import HTTPManager from "./HTTPManager.js";
import SERVER_URL from "./consts.js";

const httpManager = new HTTPManager(SERVER_URL);
const submitButton = document.getElementById('submit-btn');
submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const partnerFirstName = document.getElementById('first-name');
    const partnerLastName = document.getElementById('last-name');
    const partnerSchool = document.getElementById('school');
    const partnerProgram = document.getElementById('program');

    // TODO : Compléter la création de l'objet du partenaire
    const partner = {
        firstName: partnerFirstName.value,
        lastName: partnerLastName.value,
        school: partnerSchool.value,
        program: partnerProgram.value
    };

    // TODO : Ajouter un nouveau partenaire à travers le serveur.
    // TODO : Rediriger l'utilisateur vers index.html en cas de réussite ou /error.html en cas d'échec
    try {
        const response = await httpManager.post('/api/partner', partner);

        alert("L'étudiant avec le nom " + response.firstName + " a été créé !");
        window.location.href = '/index.html';
    } catch (error) {
        alert("Échec de la création du partenaire ! - " + error.message);
        window.location.href = '/error.html';
    }
});
