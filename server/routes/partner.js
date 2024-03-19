const path = require("path");
const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { FileManager } = require("../managers/fileManager");
const { PartnerManager } = require("../managers/partnerManager");
const { ReviewManager } = require("../managers/reviewManager");
require("express");

const partnerManager = new PartnerManager(
  new FileManager(path.join(__dirname + "/../data/partners.json"))
);

const reviewManager = new ReviewManager(
  new FileManager(path.join(__dirname + "/../data/reviews.json"))
);

router.get("/", async (request, response) => {
  try {
    const partners = await partnerManager.getPartners();

    if (partners.length !== 0) {
      response.status(HTTP_STATUS.SUCCESS).json(partners);
    } else {
      response.status(HTTP_STATUS.NO_CONTENT).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/* TODO : Ajouter les routes nécessaires pour compléter les fonctionnalitées suivantes :
    - Obtenir un partenaire en fonction de son identifiant
    - Supprimer un partenaire en fonction de son identifiant ET supprimer toutes les revues pour ce partenaire
    - Ajouter un nouveau partenaire
        - Envoyer le nouveau partenaire dans la réponse HTTP
    Note : utilisez les méthodes HTTP et les codes de retour appropriés
*/

// Obtenir un partenaire en fonction de son identifiant
router.get("/:id", async (request, response) => {
  try {
    const partner = await partnerManager.getPartner(request.params.id);

    if (partner !== undefined) {
      response.status(HTTP_STATUS.SUCCESS).json(partner); // dans le body on met partner
    } else {
      response.status(HTTP_STATUS.NO_CONTENT).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

// Supprimer un partenaire en fonction de son identifiant ET supprimer toutes les revues pour ce partenaire
router.delete("/:id", async (request, response) => {
  try {
    const deletedPartner = await partnerManager.deletePartner(
      request.params.id
    );

    if (deletedPartner) {
      await reviewManager.deleteReviewsMatchingPredicate(
        (review) => review.reviewedPartnerId === request.params.id
      );

      response.status(HTTP_STATUS.NO_CONTENT).send();
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

// Ajouter un nouveau partenaire
router.post("/", async (request, response) => {
  try {
    const partner = request.body;
    partnerManager.getPartners();

    const partners = await partnerManager.addPartner(partner);

    console.log(partners);
    console.log(partners.length);

    if (partner) {
      response.status(HTTP_STATUS.CREATED).json(partner);
    } else {
      response.status(HTTP_STATUS.NO_CONTENT).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.BAD_REQUEST).json(error);
  }
});

module.exports = { router, partnerManager };
