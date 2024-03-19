const { randomUUID } = require("crypto");

class ReviewManager {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  /**
   * TODO : Récupérer les revues du fichier JSON
   * @returns {Object[]} la liste des revues du fichier JSON
   */
  async getReviews() {
    const jsonFile = await this.fileManager.readFile();
    return JSON.parse(jsonFile);
  }

  /**
   * TODO : Rcupérer les revues pour un partenaire spécifique
   * @param {string} partnerId l'identifiant du partenaire
   * @returns {Object[]} la liste des revues pour un partenaire donné
   */
  async getReviewsForPartner(partnerId) {
    const reviews = await this.getReviews();

    const partnerReviewList = reviews.filter((review) => {
      return review.reviewedPartnerId === partnerId;
    });

    return partnerReviewList;
  }

  /**
   * TODO : Ajouter une nouvelle revue au fichier JSON
   * @param {Object} review la revue à ajouter
   * @returns {Object[]} la nouvelle liste de revues
   */
  async addReview(review) {
    // ID généré aléatoirement
    review.id = randomUUID();

    const reviews = await this.getReviews();
    review.likes = 0;
    reviews.push(review);
    await this.fileManager.writeFile(JSON.stringify(reviews));

    return reviews;
  }

  /**
   * TODO : Incrémenter le compter de "likes" d'une revue et mettre à jour le fichier
   * @param {string} reviewId identifiant de la revue
   * @returns {boolean} true si la revue existe, false sinon
   */
  async likeReview(reviewId) {
    const reviews = await this.getReviews();

    const searchedReview = reviews.find((review) => review.id === reviewId);

    if (searchedReview !== undefined) {
      searchedReview.likes += 1;
      await this.fileManager.writeFile(JSON.stringify(reviews));
      return true;
    }

    return false;
  }

  async dislikeReview(reviewId) {
    const reviews = await this.getReviews();

    const searchedReview = reviews.find((review) => review.id === reviewId);

    if (searchedReview !== undefined && searchedReview.likes > 0) {
      searchedReview.likes -= 1;
      await this.fileManager.writeFile(JSON.stringify(reviews));
      return true;
    }

    return false;
  }

  /**
   * Supprime les revues en fonction d'un prédicat
   * @example
   * // récupère toutes les révues pour un partenaire spécifique
   * const predicate = (review) => review.reviewedPartnerId === partnerId)
   * @param {Function} predicate fonction qui détermine le critère de filtre pour les revues à supprimer
   * @returns {boolean} true si des revues ont été supprimés, false sinon
   */
  async deleteReviewsMatchingPredicate(predicate) {
    const reviews = await this.getReviews();

    const remainingReviews = reviews.filter((review) => !predicate(review));

    await this.fileManager.writeFile(JSON.stringify(remainingReviews, null, 2));

    return remainingReviews.length !== reviews.length;
  }
}

module.exports = { ReviewManager };
