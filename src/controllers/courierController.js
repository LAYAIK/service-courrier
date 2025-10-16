import db from "../models/index.js";
const { Courrier, Document,HistoriqueCourrier } = db;
import { Op } from "sequelize";
import sequelize from "../config/sequelizeInstance.js";

export const getAllCouriers = async (req, res) => {
    try {
        const couriers = await Courrier.findAll();
        if (!couriers || couriers.length === 0) {
            return res.status(404).json({ message: 'Aucun courrier trouvé' });
        }
        res.status(200).json(couriers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des courriers' });
    }
}

export const getCourierById = async (req, res) => { 

        const  id  = req.params.id;
    try { 
        if (!id) {
            return res.status(400).json({ message: 'L\'ID du courrier est requis' });
        }
        let filtre = {};
        if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) { // verifier si l'id est un nombre
            filtre = { id_courrier: id };
        } else {
            filtre = {
                [Op.or]: [
                    //{ id_courrier: id },
                    { reference_courrier: id }
                ]
            };
        }   
        const courier = await Courrier.findOne({ where: filtre });
        if (!courier) {
            return res.status(404).json({ message: 'Courrier non trouvé' });
        }
        res.status(200).json(courier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du courrier' });
    }
}

export const createCourier = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      id_objet,
      date_envoi,
      date_reception,
      date_archivage,
      date_traitement,
      est_archive,
      id_structure,
      id_priorite,
      contenu,
      note,
      id_type_courrier,
      id_status,
      id_structure_destinataire,
      id_utilisateur,
      reference_courrier // facultatif
    } = req.body;

    if (!id_objet || !id_type_courrier || !id_structure || !id_utilisateur) {
      throw new Error("Certains champs obligatoires sont manquants.");
    }

    // === 1. Vérification si la référence est fournie ===
    let finalRef = reference_courrier?.trim() || null;

    if (finalRef) {
      // Vérifie que la référence n'existe pas déjà
      const existingRef = await Courrier.findOne({
        where: { reference_courrier: finalRef },
        transaction: t,
      });

      if (existingRef) {
        throw new Error("Un courrier avec cette référence existe déjà !");
      }
    } else {
      // === 2. Génération automatique ===
      const now = new Date();
      const year = String(now.getFullYear()).slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const randomNumber = Math.floor(1000 + Math.random() * 9000);

      const dernier = await Courrier.findOne({
        order: [["createdAt", "DESC"]],
        attributes: ["reference_courrier"],
        lock: true,
        transaction: t,
      });

      let nextNumber = 1;
      if (dernier && dernier.reference_courrier) {
        // Extraction du numéro
        const match = dernier.reference_courrier.match(/-(\d+)-/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      finalRef = `DRH${randomNumber}-${nextNumber}-${month}-${year}`;
    }

    // === 3. Création du courrier principal ===
    const newCourier = await Courrier.create(
      {
        reference_courrier: finalRef,
        contenu,
        est_archive: est_archive ?? false,
        date_envoi,
        date_reception,
        date_archivage,
        date_traitement,
        id_type_courrier,
        id_status,
        id_priorite,
        id_structure,
        id_structure_destinataire,
        id_utilisateur,
        id_objet,
        note,
      },
      { transaction: t }
    );

    // === 4. Gestion des fichiers joints ===
    if (req.files && req.files.length > 0) {
      const fichiers = req.files.map((file) => ({
        libelle: file.originalname,
        chemin_serveur: file.path,
        type_mime: file.mimetype,
        taille: file.size,
        id_courrier: newCourier.id_courrier,
      }));

      await Document.bulkCreate(fichiers, { transaction: t });
    }

    // === 5. Historique automatique ===
    await HistoriqueCourrier.create(
      {
        id_courrier: newCourier.id_courrier,
        action: "Création du courrier",
        id_structure,
        id_utilisateur,
        id_type_courrier,
        reference_courrier: finalRef,
        id_objet,
        note: "Courrier créé avec succès",
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: "Courrier créé avec succès",
      courrier: newCourier,
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ Erreur création courrier:", error);

    if (error.message.includes("existe déjà")) {
      return res.status(409).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: "Erreur interne lors de la création du courrier" });
  }
};


export const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;

        const { id_objet, date_envoi,date_reception,date_archivage,date_traitement,id_utilisateur,
            est_archive, id_destinataires, id_status,id_structure_destinataire,note, reference_courrier,
            id_structure,id_priorite,documents_associes, contenu , id_type_courrier, id_archive } = req.body;


            console.log('mise a jour data', req.body);

            console.log('fichier', req.files)
            
            if (!id_utilisateur && !id) {
                return res.status(400).json({ message: 'L\'ID du courrier et l\'utilisateur sont requis' });
            }

             // Check if the id_structure_destinataire is an empty string and convert it to null
    const final_id_structure_destinataire = id_structure_destinataire === '' ? null : id_structure_destinataire;
          

    // If your frontend sends the data as a stringified JSON object (e.g., 'formData')
        // const formData = JSON.parse(req.body.formData);
        // const { id_objet, ... } = formData;
    
    // 3. Get the files if they exist (will be in req.files)
      //const uploadedFiles = req.files;

        let filtre = {};
        if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) { // verifier si l'id est un nombre
            filtre = { id_courrier: id };
        } else {
            filtre = {
                [Op.or]: [
                    //{ id_courrier: id },
                    { reference_courrier: id }
                ]
            };
        } 
        
     const result = await sequelize.transaction(async (t) => {
        const courier = await Courrier.findOne({ where: filtre }, { transaction: t, lock: t.LOCK.UPDATE });
        if (!courier) {
            return res.status(404).json({ message: 'Courrier non rencontré' });
        }
        if (documents_associes) courier.documents_associes = documents_associes;
        if (date_archivage) courier.date_archivage = date_archivage;
        if (date_envoi) courier.date_envoi = date_envoi;
        if (date_reception) courier.date_reception = date_reception;
        if (date_traitement) courier.date_traitement = date_traitement;
        if (id_type_courrier) courier.id_type_courrier = id_type_courrier;
        if (id_archive) courier.id_archive = id_archive;
        if (id_destinataires) courier.id_destinataires = id_destinataires;
        if (est_archive) courier.est_archive = est_archive;
        if (id_priorite) courier.id_priorite = id_priorite;
        if (id_status) courier.id_status = id_status;
        if (id_structure) courier.id_structure = id_structure;
        if (id_objet) courier.id_objet = id_objet;
        if (contenu) courier.contenu = contenu;
        if (note) courier.note= note;
        if (id_structure_destinataire) courier.id_structure_destinataire = final_id_structure_destinataire;
        await courier.save({ transaction: t });

        if (req.files && req.files.length > 0) {
                const fichiersauvegarder = req.files.map(file => ({
                    libelle: file.originalname,
                    chemin_serveur: file.path,
                    type_mime: file.mimetype,
                    taille: file.size,
                    id_courrier: id
                }));
                await Document.bulkCreate(fichiersauvegarder, { transaction: t });
            }

        // Enregistrer l'action dans l'historique
            await HistoriqueCourrier.create({
                id_courrier: id,
                action: 'Modifier',
                id_structure: id_structure,
                id_structure_destinataire:final_id_structure_destinataire,
                id_utilisateur: id_utilisateur,
                id_type_courrier: id_type_courrier,
                id_objet: id_objet,
                reference_courrier: reference_courrier,
                note: note,
            }, { transaction: t })

            // Retourner les informations mises à jour
            return {
                message: 'Courrier mis à jour avec succès',
                courrier: courier.toJSON()
            };
    });
    res.status(200).json(result);
    } catch (error) {
        console.error(error);
        console.log('erreur ',error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du courrier' });
    }
}

export const deleteCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const { reference_courrier,id_utilisateur,id_structure_destinataire, id_structure,id_type_courrier, id_objet } = req.body;
        // Check if the id_structure_destinataire is an empty string and convert it to null
        const final_id_structure_destinataire = id_structure_destinataire === '' ? null : id_structure_destinataire;
        if (!id) {
            return res.status(400).json({ message: 'L\'ID du courrier est requis' });
        }
        let filtre = {};
        if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) { // verifier si l'id est un nombre
            filtre = { id_courrier: id };
        } else {
            filtre = {
                [Op.or]: [
                    //{ id_courrier: id },
                    { reference_courrier: id }
                ]
            };
        }
        const result = await sequelize.transaction(async (t) => {

        const courier = await Courrier.findOne({ where: filtre }, { transaction: t, lock: t.LOCK.UPDATE });
        if (!courier) {
            return res.status(404).json({ message: 'Courrier non rencontré' });
        }
        
        // Enregistrer l'action dans l'historique
        await HistoriqueCourrier.create({
            id_courrier: id,
            action: 'Supprimer',
            id_structure: id_structure,
            id_structure_destinataire:final_id_structure_destinataire,
            id_utilisateur: id_utilisateur,
            note:'suppimé de la liste des courriers',
            id_type_courrier: id_type_courrier,
            reference_courrier: reference_courrier,
            id_objet: id_objet
        }, { transaction: t })

        // suppresion du courrier
        await courier.destroy({ transaction: t });

        // Retourner les informations mises à jour
        return {
                message: 'Courrier supprimé avec succèss',
            };
    });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du courrier' });
    }
}

export const searchCouriers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Le paramètre de recherche (query) est requis.' });
        }
        const whereConditions = {
            [Op.or]: [
                //{ objet: { [Op.iLike]: `%${query}%` } },
                { reference_courrier: { [Op.iLike]: `%${query}%` } },
                //{ id_archive: { [Op.iLike]: `%${query}%` } },
                { contenu: { [Op.iLike]: `%${query}%` } }
            ]
        };
        const dateQuery = new Date(query);
        if (!isNaN(dateQuery.getTime())) { 
            const startOfDay = new Date(dateQuery);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(dateQuery);
            endOfDay.setHours(23, 59, 59, 999);

            whereConditions[Op.or].push({
                date_envoi: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            });
        };
        const couriers = await Courrier.findAll({
            where: whereConditions
        });
        res.status(200).json(couriers);
    } catch (error) {
        console.error('Erreur lors de la recherche des courriers:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche des courriers' });
    }
}

// Assurez-vous d'avoir une fonction d'erreur pour les réponses
const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({ message });
};
export const transfertCourier = async (req, res) => {
    // 1. Récupérer les données depuis la requête
    const {id_structure_nouveau, id_status, id_utilisateur_transfert, note, id_type_courrier, id_priorite, delais_traitement } = req.body;
    const  id_courrier  = req.params.id;

    // 2. Vérifier que l'ID du courrier est fourni
    if (!id_courrier) {
        return sendError(res, 400, 'L\'ID du courrier est requis dans les paramètres de l\'URL.');
    }
    console.log('Transfert de courrier:', req.body);
    // 3. Validation des données
    if (!id_structure_nouveau || !id_status) {
        return sendError(res, 400, 'Les identifiants du courrier, de la nouvelle structure et du statut sont requis.');
    }

    // 4. Utilisation d'une transaction pour garantir l'atomicité des opérations
    try {
        const result = await sequelize.transaction(async (t) => {
            // Rechercher le courrier et le verrouiller pour la transaction
            const courrier = await Courrier.findByPk(id_courrier, { transaction: t, lock: t.LOCK.UPDATE });

            if (!courrier) {
                return sendError(res, 404, 'Courrier non trouvé.');
            }

            // Mettre à jour le courrier
            const ancien_id_structure = courrier.id_structure;
            courrier.id_status = id_status; 
            courrier.id_structure = id_structure_nouveau;
            courrier.id_utilisateur = null; 
            courrier.id_priorite = id_priorite || courrier.id_priorite;
            courrier.note = note;
            courrier.delais_traitement = delais_traitement;
            
            await courrier.save({ transaction: t });

            if (req.files && req.files.length > 0) {
                const fichiersauvegarder = req.files.map(file => ({
                    libelle: file.originalname,
                    chemin_serveur: file.path,
                    type_mime: file.mimetype,
                    taille: file.size,
                    id_courrier: id_courrier
                }));
                await Document.bulkCreate(fichiersauvegarder, { transaction: t });
            }

            // Enregistrer l'action dans l'historique
            await HistoriqueCourrier.create({
                id_courrier: id_courrier,
                action: 'Transfert',
                id_structure: ancien_id_structure,
                id_structure_destinataire: id_structure_nouveau,
                id_utilisateur: id_utilisateur_transfert,
                id_type_courrier: id_type_courrier,
                note: note,
                id_objet: courrier.id_objet,
                reference_courrier: courrier.reference_courrier,
            }, { transaction: t });

            // Retourner les informations mises à jour
            return courrier.toJSON();
            
        });

        // Envoyer la réponse finale si la transaction réussit
        res.status(200).json(result);

    } catch (error) {
        console.error('Erreur lors du transfert du courrier:', error);
        // La transaction sera automatiquement annulée en cas d'erreur
        sendError(res, 500, 'Une erreur interne est survenue.');
    }
};
