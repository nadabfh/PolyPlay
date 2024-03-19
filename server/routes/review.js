const path = require("path");
const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { FileManager } = require("../managers/fileManager");
const { ReviewManager } = require("../managers/reviewManager");

const reviewManager = new ReviewManager(
  new FileManager(path.join(__dirname + "/../data/reviews.json"))
);

router.get("/", async (request, response) => {
  try {
    const reviews = await reviewManager.getReviews();

    if (reviews.length !== 0) {
      response.status(HTTP_STATUS.SUCCESS).json(reviews);
    } else {
      response.status(HTTP_STATUS.NO_CONTENT).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.get("/:partnerId", async (request, response) => {
  try {
    const reviews = await reviewManager.getReviewsForPartner(
      request.params.partnerId
    );
    if (reviews.length !== 0) {
      response.status(HTTP_STATUS.SUCCESS).json(reviews);
    } else {
      response.status(HTTP_STATUS.NO_CONTENT).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/* TODO : Ajouter les routes nécessaires pour compléter les fonctionnalitées suivantes :
    - Incrémenter le compteur de "likes" d'une revue en fonction de son identifiant
    - Supprimer une revue en fonction de son identifant
    - Ajouter une nouvelle revue seulement après avoir validé que tous les éléments nécessaires sont envoyés
        - Envoyer la nouvelle revue dans la réponse HTTP
    Note : utilisez les méthodes HTTP et les codes de retour appropriés
*/

// Incrémenter le compteur de "likes" d'une revue en fonction de son identifiant
router.patch("/:reviewId", async (request, response) => {
  try {
    const { action } = request.body;
    let review;

    if (action === "like") {
      review = await reviewManager.likeReview(request.params.reviewId);
    } else if (action === "dislike") {
      review = await reviewManager.dislikeReview(request.params.reviewId);
    } else {
      return response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Action non valide." });
    }

    if (review) {
      response.status(HTTP_STATUS.SUCCESS).json(review);
    } else {
      response
        .status(HTTP_STATUS.NOT_FOUND)
        .send({ message: "Revue non trouvée." });
    }
  } catch (error) {
    console.error(error);
    response
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: "Erreur interne du serveur.", error });
  }
});

// Supprimer une revue en fonction de son identifant
router.delete("/:id", async (request, response) => {
  try {
    const deletedReview = await reviewManager.deleteReviewsMatchingPredicate(
      (review) => review.id === request.params.id
    );

    if (deletedReview) {
      response.status(HTTP_STATUS.NO_CONTENT).send(deletedReview);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

// Ajouter une nouvelle revue seulement après avoir validé que tous les éléments nécessaires sont envoyés
router.post("/", async (request, response) => {
  try {
    const reviewInfo = request.body;

    if (!reviewInfo) {
      response.status(HTTP_STATUS.BAD_REQUEST).json(error);
      return;
    }

    if (
      !reviewInfo.rating ||
      !reviewInfo.comment ||
      !reviewInfo.author ||
      !reviewInfo.reviewedPartnerId
    ) {
      response.status(HTTP_STATUS.BAD_REQUEST).json(error);
      return;
    }

    const previousReviews = await reviewManager.getReviews();
    const returnedReviews = await reviewManager.addReview(reviewInfo);

    if (previousReviews.length < returnedReviews.length) {
      response.status(HTTP_STATUS.CREATED).json(returnedReviews);
    } else {
      response.status(HTTP_STATUS.NO_CONTENT).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router, reviewManager };
