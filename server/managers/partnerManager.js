const { randomUUID } = require("crypto");

class PartnerManager {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  /**
   * TODO : Récupérer les partenaires du fichier JSON
   * @returns {Object[]} la liste des partenaires du fichier JSON
   */
  async getPartners() {
    const jsonFile = await this.fileManager.readFile();
    const partnersArray = JSON.parse(jsonFile);
    return partnersArray;
  }

  /**
   * TODO : Récupérer un partenaire en fonction de son identifiant
   * @param {string} partnerId l'identifiant du partenaire
   * @returns {Object| undefined} le partenaire, si existant
   */
  async getPartner(partnerId) {
    const partners = await this.getPartners();
    const searchedPartner = partners.find((partner) => partner.id === partnerId);

    return searchedPartner || undefined;
  }

  /**
   * TODO : Ajouter un nouveau partenaire au fichier JSON
   * @param {Object} partner le partenaire à ajouter
   * @returns {Object[]} la liste des partenaires
   */
  async addPartner(partner) {
    partner.id = randomUUID();
    const partners = await this.getPartners();
    partners.push(partner);
    await this.fileManager.writeFile(JSON.stringify(partners));
    return partners;
  }

  /**
   * TODO : Supprimer un partenaire du fichier JSON
   * @param {string} partnerId l'identifiant du partenaire
   * @returns {boolean} true si suppression, false sinon
   */
  async deletePartner(partnerId) {
    const partnerToDelete = await this.getPartner(partnerId);

    if (partnerToDelete !== undefined) {
      const partners = await this.getPartners();
      const arrayWithoutPartner = partners.filter(
        (partner) => partner.id !== partnerToDelete.id
      );

      await this.fileManager.writeFile(JSON.stringify(arrayWithoutPartner));
      return true;
    }

    return false;
  }
}

module.exports = { PartnerManager };
