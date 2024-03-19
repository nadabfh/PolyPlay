/* eslint-disable no-magic-numbers */
import HTTPManager from './HTTPManager.js';
import SERVER_URL from './consts.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const partnerId = urlParams.get('id');

const httpManager = new HTTPManager(SERVER_URL);

const submitButton = document.getElementById('submit-btn');
const deleteButton = document.getElementById('delete-btn');

// TODO : récupérer le partenaire à travers l'identifiant dans l'URL
console.log(partnerId);
async function loadPartners() {
    try {
        const response = await httpManager.get(`/api/partner/${partnerId}`);
        if (response) {
            return response;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données du partenaire :', error);
}
}

const partner = await loadPartners();

if (partner) {
    document.getElementById('profile-firstName').textContent = partner.firstName;
    document.getElementById('profile-lastName').textContent = partner.lastName;
    document.getElementById('school').textContent = partner.school;
    document.getElementById('program').textContent = partner.program;
};

//  TODO : récupérer les revues pour le partenaire à travers l'identifiant dans l'URL
async function loadReviews() {
    try {
        const response = await httpManager.get(`/api/review/${partnerId}`);
        if (response) {
            return response;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des revues du partenaire :', error);
}
}

const reviews = await loadReviews();
if (reviews) {
    const reviewsContainer = document.getElementById('reviews-list');
    reviewsContainer.innerHTML = "";
    reviews.forEach(review => {
        reviewsContainer.appendChild(createReviewElement(review));
    });
};

submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const rating = document.getElementById('rate');
    const comment = document.getElementById('comment');
    const author = document.getElementById('author');
    const review = {
        rating: rating.value,
        comment: comment.value,
        author: author.value,
        reviewedPartnerId: partnerId,
        date: new Date().toISOString().slice(0, 10)
    };

    // TODO : Ajouter une nouvelle revue sur le serveur
    // TODO : Rafraichir la page en cas de réussite ou rediriger l'utilisateur vers la page /error.html en cas d'échec
    try {
        await httpManager.post('/api/review', review);
        alert("Votre revue a été soumise !");
        window.location.reload();
    } catch (error) {
        alert("Échec de la soumission de la revue !");
        window.location.href = '/error.html';
    }
});

deleteButton.addEventListener('click', async (e) => {
    e.preventDefault();
    // TODO : Supprimer le partenaire sur le serveur
    // TODO : Rediriger l'utilisateur vers index.html en cas de réussite ou /error.html en cas d'échec
    try {
        await httpManager.delete(`/api/partner/${partnerId}`);
        alert("L'étudiant a été supprimé !");
        window.location.href = '/index.html';
    } catch (error) {
        alert("Échec de la suppression de l'étudiant !");
        window.location.href = '/error.html';
    }
});

function createReviewElement(review) {
    const parent = document.createElement('div');
    parent.classList.add('review-container');

    const rating = document.createElement('p');
    rating.classList.add('rating');
    rating.textContent = review.rating;
    parent.appendChild(rating);

    const author = document.createElement('p');
    rating.classList.add('author');
    author.textContent = review.author;
    parent.appendChild(author);

    const comment = document.createElement('p');
    comment.classList.add('comment');
    comment.textContent = review.comment;
    parent.appendChild(comment);

    const date = document.createElement('p');
    date.classList.add('date');
    date.textContent = review.date;
    parent.appendChild(date);

    const likes = document.createElement('p');
    likes.classList.add('likes');
    likes.textContent = review.likes;
    parent.appendChild(likes);

    const likeBtn = document.createElement('button');
    likeBtn.textContent = '👍';

    // TODO : Envoyer une demande d'incrémentation des "like" de la revue et mettre à jour la vue avec la nouvelle valeur
    likeBtn.addEventListener('click', async () => {
        try {
            await httpManager.patch(`/api/review/${review.id}`, { action: 'like' });
            review.likes++;
            likes.textContent = review.likes;
        } catch (error) {
            console.error("Erreur lors de l'ajout d'un like à la revue :", error);
        }
     });
    parent.appendChild(likeBtn);

    // BONUS : Bouton dislike
    const dislikeBtn = document.createElement('button');
    dislikeBtn.textContent = '👎';

    dislikeBtn.addEventListener('click', async () => {
        try {
            await httpManager.patch(`/api/review/${review.id}`, { action: 'dislike' });
            review.likes--;
            likes.textContent = review.likes;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du dislike :", error);
        }
    });
    parent.appendChild(dislikeBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "X";
    // TODO : Supprimer une revue et mettre à jour la vue
    deleteBtn.addEventListener('click', async () => {
        try {
            await httpManager.delete(`/api/review/${review.id}`);
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la suppression de la revue :", error);
        }
     });

    parent.appendChild(deleteBtn);

    return parent;
}
