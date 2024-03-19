import HTTPManager from "./HTTPManager.js";
import SERVER_URL from "./consts.js";

// TODO : Charger tous les partenaires du serveur
const httpManager = new HTTPManager(SERVER_URL);
async function loadPartners() {
    try {
        const response = await httpManager.get('/api/partner');
        if (response) {
            return response;
        }
    } catch (error) {
        console.error("Error loading partners:", error);
    }
    return null;
}

const partnersList = await loadPartners();

function generateHTML(partnersList) {
    if (!partnersList) {
        return;
    };
    const partnersContainer = document.getElementById('partners-container');
    partnersContainer.innerHTML = "";

    partnersList.forEach(partner => {
        const partnerHTML = `
        <div class="partner">
            <h3>${partner.firstName}</h3>
            <h3>${partner.lastName}</h3>
            <h4>${partner.school}</h4>
            <a href="partner.html?id=${partner.id}">Voir le profil</a>
        </div>
        `;
        partnersContainer.innerHTML += partnerHTML;
    });
};
generateHTML(partnersList);
