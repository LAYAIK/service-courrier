import db from "../models/index.js";
const { Courrier } = db;
import { Op } from "sequelize";

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
                    { numero_courrier: id }
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
    
    try {
        const { id_objet, date_envoi,date_reception,date_archivage,date_traitement,id_archive,
            est_archive, numero_courrier,id_structure,id_priorite,documents_associes, contenu , type_courrier, id_status } = req.body;
        if ( !numero_courrier || !contenu) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }   
        const existingCourier = await Courrier.findOne({ where: { numero_courrier } }); 
        if (existingCourier) {
            return res.status(400).json({ message: 'Un courrier avec ce numéro de courrier existe deja' });
        }
        const newCourier = await Courrier.create({est_archive ,numero_courrier,contenu });

        if (documents_associes) {
            newCourier.documents_associes = documents_associes;
        }
        if (date_archivage) {
            newCourier.date_archivage = date_archivage;
        }
        if (date_envoi) {
            newCourier.date_envoi = date_envoi;
        }
        if (date_reception) {
            newCourier.date_reception = date_reception;
        }
        if (date_traitement) {
            newCourier.date_traitement = date_traitement;
        }
        if (type_courrier) {
            newCourier.type_courrier = type_courrier;
        }
        if (id_archive) {
            newCourier.id_archive = id_archive;
        }
        if (id_objet) {
            newCourier.id_objet = id_objet;
        }
        if(id_priorite) {
            newCourier.id_priorite = id_priorite;
        }
        if(id_structure) {
            newCourier.id_structure = id_structure;
        }
        if (id_status) {
            newCourier.id_status = id_status;
        }
        await newCourier.save();
        res.status(201).json({message: 'Courrier créé avec succès', newCourier});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du courrier' });
    }
}

export const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'L\'ID du courrier est requis' });
        }
        const { id_objet, date_envoi,date_reception,date_archivage,date_traitement,
            est_archive, id_destinataires, id_status,
            id_structure,id_priorite,documents_associes, contenu , type_courrier, id_archive } = req.body;

        let filtre = {};
        if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) { // verifier si l'id est un nombre
            filtre = { id_courrier: id };
        } else {
            filtre = {
                [Op.or]: [
                    //{ id_courrier: id },
                    { numero_courrier: id }
                ]
            };
        }   
        const courier = await Courrier.findOne({ where: filtre });
        if (!courier) {
            return res.status(404).json({ message: 'Courrier non rencontré' });
        }
        if (documents_associes) courier.documents_associes = documents_associes;
        if (date_archivage) courier.date_archivage = date_archivage;
        if (date_envoi) courier.date_envoi = date_envoi;
        if (date_reception) courier.date_reception = date_reception;
        if (date_traitement) courier.date_traitement = date_traitement;
        if (type_courrier) courier.type_courrier = type_courrier;
        if (id_archive) courier.id_archive = id_archive;
        if (id_destinataires) courier.id_destinataires = id_destinataires;
        if (est_archive) courier.est_archive = est_archive;
        if (id_priorite) courier.id_priorite = id_priorite;
        if (id_status) courier.id_status = id_status;
        if (id_structure) courier.id_structure = id_structure;
        if (id_objet) courier.id_objet = id_objet;
        if (contenu) courier.contenu = contenu;
        await courier.save();
        res.status(200).json({ message: 'Courrier mis à jour avec succès', courier });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du courrier' });
    }
}

export const deleteCourier = async (req, res) => {
    try {
        const { id } = req.params;
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
                    { numero_courrier: id }
                ]
            };
        }
        const courier = await Courrier.findOne({ where: filtre });
        if (!courier) {
            return res.status(404).json({ message: 'Courrier non trouvé' });
        }
        await courier.destroy();
        res.status(200).json({ message: 'Courrier supprimé avec succès' });
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
                { numero_courrier: { [Op.iLike]: `%${query}%` } },
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
