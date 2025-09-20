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

// A more robust and correct version of your controller function
export const createCourier = async (req, res) => {
    try {
        // Destructuring variables at the top for clarity
        const {
            id_objet, date_envoi, date_reception, date_archivage, date_traitement,
            est_archive, reference_courrier, id_structure, id_priorite, contenu,
            id_type_courrier, id_status, id_structure_destinataire, id_utilisateur
        } = req.body;

        console.log(' data de la requête ', req.body);
        
        // Log files to see if Multer is working correctly
        console.log('Fichiers téléchargés:', req.files);

        // Basic validation
        if (!reference_courrier || !contenu) {
            return res.status(400).json({ message: 'Les champs reference_courrier et contenu sont requis.' });
        }

        // Use a managed transaction to ensure data integrity
        const transactionResult = await sequelize.transaction(async (t) => {
            const existingCourier = await Courrier.findOne({ where: { reference_courrier } }, { transaction: t });
            if (existingCourier) {
                throw new Error('Un courrier avec cette référence existe déjà.');
            }

            // Create the new courier record
            const newCourier = await Courrier.create({
                est_archive, reference_courrier, contenu, date_envoi, date_reception,
                date_archivage, date_traitement, id_type_courrier, id_status,
                id_structure, id_priorite, id_objet, id_structure_destinataire, id_utilisateur
            }, { transaction: t });

            // If files were uploaded, process and save them
            const fichierTelecharger = req.files;
            if (fichierTelecharger && fichierTelecharger.length > 0) {
                const fichiersauvegarder = fichierTelecharger.map(file => ({
                    libelle: file.originalname,
                    chemin_serveur: file.path,
                    type_mime: file.mimetype,
                    taille: file.size,
                    id_courrier: newCourier.id_courrier
                }));
                await Document.bulkCreate(fichiersauvegarder, { transaction: t });
            }

            // Record the action in the history
            const note = 'Le courrier a bien été créé';
            await HistoriqueCourrier.create({
                id_courrier: newCourier.id_courrier,
                action: 'Enregistrer',
                id_structure: id_structure,
                id_utilisateur: id_utilisateur,
                id_type_courrier: id_type_courrier,
                note: note
            }, { transaction: t });
            
            // Return the result from the transaction to be sent to the client
            return {
                message: 'Courrier créé avec succès',
                courrier: newCourier.toJSON()
            };
        });

        // If the transaction is successful, send the final response
        res.status(201).json(transactionResult);

    } catch (error) {
        // This catch block handles all errors, including the one we threw
        console.error('Erreur lors de la création du courrier:', error);
        
        // Check for specific error types to provide better feedback
        if (error.message.includes('Un courrier avec cette référence existe déjà')) {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        
        // Send a generic 500 error for unhandled exceptions
        res.status(500).json({ message: 'Erreur interne du serveur lors de la création du courrier' });
    }
};

export const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;

        const { id_objet, date_envoi,date_reception,date_archivage,date_traitement,id_utilisateur,
            est_archive, id_destinataires, id_status,id_structure_destinataire,note,
            id_structure,id_priorite,documents_associes, contenu , id_type_courrier, id_archive } = req.body;
            
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
        if(note) courier.note= note;
        if (id_structure_destinataire) courier.id_structure_destinataire = final_id_structure_destinataire;
        await courier.save({ transaction: t });

        // Enregistrer l'action dans l'historique
            await HistoriqueCourrier.create({
                id_courrier: id,
                action: 'Modifier',
                id_structure: id_structure,
                id_structure_destinataire:final_id_structure_destinataire,
                id_utilisateur: id_utilisateur,
                id_type_courrier: id_type_courrier
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
    const {id_structure_nouveau, id_status, id_utilisateur_transfert, note, id_type_courrier } = req.body;
    const  id_courrier  = req.params.id;

    // 2. Vérifier que l'ID du courrier est fourni
    if (!id_courrier) {
        return sendError(res, 400, 'L\'ID du courrier est requis dans les paramètres de l\'URL.');
    }
    console.log('Transfert de courrier:', { id_courrier, id_structure_nouveau, id_status, id_utilisateur_transfert, id_note });
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
            await courrier.save({ transaction: t });

            // Enregistrer l'action dans l'historique
            await HistoriqueCourrier.create({
                id_courrier: id_courrier,
                action: 'Transfert',
                id_structure: ancien_id_structure,
                id_structure_destinataire: id_structure_nouveau,
                id_utilisateur: id_utilisateur_transfert,
                id_type_courrier: id_type_courrier,
                note: note
            }, { transaction: t });

            // Retourner les informations mises à jour
            return {
                message: 'Courrier transféré avec succès.',
                courrier: courrier.toJSON()
            };
        });

        // Envoyer la réponse finale si la transaction réussit
        res.status(200).json(result);

    } catch (error) {
        console.error('Erreur lors du transfert du courrier:', error);
        // La transaction sera automatiquement annulée en cas d'erreur
        sendError(res, 500, 'Une erreur interne est survenue.');
    }
};
