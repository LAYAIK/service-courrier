import db from '../models/index.js';
const { Archive } = db;
import { Op } from 'sequelize';

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
}

export const createArchive = async (req, res) => {
    try {
        const { description, date_archivage, id_utilisateur,id_courrier } = req.body;
        if ( !id_utilisateur || !id_courrier) {
            return res.status(400).json({ message: 'La description et id du courrier est requise' });
        }
        const existing = await Archive.findOne({ where: { id_courrier } });
        if (existing) {
            return res.status(400).json({ message: 'Le courrier est deja archivé', existing });
        }
        const newArchive = await Archive.create({ id_utilisateur,id_courrier });
        if (description) newArchive.description = description;
        if (date_archivage) newArchive.date_archivage = date_archivage;
        await newArchive.save();
        res.status(201).json(newArchive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'archive' });
    }
}
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
}

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
}

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
}