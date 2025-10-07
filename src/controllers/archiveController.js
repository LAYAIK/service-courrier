import db from '../models/index.js';
const { Archive, HistoriqueCourrier, Document } = db;
import { Op } from 'sequelize';
import sequelize from "../config/sequelizeInstance.js";

export const getAllArchives = async (req, res) => {
    try {
        const archives = await Archive.findAll();
        if (archives.length === 0) {
            return res.status(404).json({ message: 'Aucune archive trouvée' });
        }
        res.status(200).json(archives);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des archives' });
    }
}

export const getArchiveById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'L\'ID de l\'archive est requis' });
        }
        const archive = await Archive.findByPk(id);
        if (!archive) {
            return res.status(404).json({ message: 'Archive non trouvée' });
        }
        res.status(200).json(archive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'archive' });
    }
};

export const createArchive = async (req, res) => {
    try {
        // Ne pas destructurer reference_courrier ici
       
        const {
            id_objet, reference_courrier,
            id_structure, note,id_courrier,
            id_type_courrier,  id_utilisateur
        } = req.body;

        console.log('data archive ;', req.body);
        console.log('Fichiers téléchargés:', req.files);

        const transactionResult = await sequelize.transaction( async (t) => {

            const newArchive = await Archive.create({ reference_courrier, id_courrier, note, id_utilisateur }, { transaction: t });

            if (req.files && req.files.length > 0) {
                const fichiersauvegarder = req.files.map(file => ({
                    libelle: file.originalname,
                    chemin_serveur: file.path,
                    type_mime: file.mimetype,
                    taille: file.size,
                    id_courrier: newArchive.id_archive
                }));
                await Document.bulkCreate( fichiersauvegarder, { transaction: t });
            }


            // 2. Émission de la notification via Socket.IO
            // Note: 'io' doit être accessible ici. Il est préférable de le passer ou l'importer.
            // io.emit('new_courrier_notification', {
            // reference_courrier: newArchive.reference_courrier,
            // id: newArchive.id_courrier,
            // // ... autres données utiles pour la notification
            // });

            await HistoriqueCourrier.create({
                id_courrier,
                action: 'Archiver',
                id_structure,
                id_utilisateur,
                id_type_courrier,
                reference_courrier,
                id_objet,
                note
            }, { transaction: t });

            return {
                message: 'Courrier archiver avec succès',
                archive: newArchive.toJSON()
            };
        });

        res.status(201).json(transactionResult);

    } catch (error) {
        console.error('Erreur lors de la création de L\'archive:', error);
        if (error.message.includes('Une Archive avec cette référence existe déjà')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: "Erreur interne du serveur lors de la création de l\'archive" });
    }
};
export const updateArchive = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, date_archivage, id_utilisateur,id_courrier } = req.body;
        const archive = await Archive.findByPk(id);
        if (!archive) {
            return res.status(404).json({ message: 'Archive non trouvée' });
        }
        if (description) archive.description = description;
        if (date_archivage) archive.date_archivage = date_archivage;
        if (id_utilisateur) archive.id_utilisateur = id_utilisateur;
        if (id_courrier) archive.id_courrier = id_courrier;
        await archive.save();
        res.status(200).json(archive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'archive' });
    }
};

export const deleteArchive = async (req, res) => {
    try {
        const { id } = req.params;
        const archive = await Archive.findByPk(id);
        if (!archive) {
            return res.status(404).json({ message: 'Archive non trouvée' });
        }
        await archive.destroy();
        res.status(200).json({ message: 'Archive supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'archive' });
    }
};

export const searchArchives = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Le paramètre de recherche (query) est requis.' });
        }
        const queryType = isNaN(query) ? 'string' : 'date';
        console.log('Type de requête:', queryType);
        const whereConditions = {
            [Op.or]: [
                //{ numero_courrier: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } }
            ]
        };
        const dateQuery = new Date(query);
        if (!isNaN(dateQuery.getTime())) { 
            const startOfDay = new Date(dateQuery);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            whereConditions[Op.or].push({
                date_archivage: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            });
        };
        const Archives = await Archive.findAll({
            where: whereConditions
        });
        res.status(200).json(Archives);
    } catch (error) {
        console.error('Erreur lors de la recherche des archives:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche des archives' });
    }
};