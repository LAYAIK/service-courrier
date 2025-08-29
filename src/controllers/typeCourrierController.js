import db from '../models/index.js';
const { TypeCourrier } = db;

export const getAllTypeCourriersController = async (req, res) => {
    try {
        const typeCourriers = await TypeCourrier.findAll();
        if(typeCourriers.length === 0) {
            return res.status(404).json({ message: 'Aucun type de courrier trouvée' });
        }
        res.status(200).json(typeCourriers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des types de courriers' });
    }
};

export const getTypeCourrierByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const typeCourrier = await TypeCourrier.findByPk(id);
        if (!typeCourrier) {
            return res.status(404).json({ message: 'Type de courrier non trouvé' });
        }
        res.status(200).json(typeCourrier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du type de courrier' });
    }
};

export const createTypeCourrierController = async (req, res) => {
    try {
        const { type , description } = req.body;
        if (!type) {
            return res.status(400).json({ message: 'Le libellé est requis' });
        }
        const typeCourrier = await TypeCourrier.create({ type });
        if (description) typeCourrier.description = description;
        await typeCourrier.save();
        res.status(201).json(typeCourrier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du type de courrier' });
    }
};

export const updateTypeCourrierController = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, description } = req.body;
        if (!type) {
            return res.status(400).json({ message: 'Le libellé est requis' });
        }
        const [updatedRows, [updatedTypeCourrier]] = await TypeCourrier.update({ type, description }, {
            where: {
                id_type_courrier: id
            },
            returning: true
        });
        if (updatedRows === 0) {
            return res.status(400).json({ message: "Aucune mise à jour effectuée et aucun type de courrier trouvée" });
        }
        res.status(200).json(updatedTypeCourrier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du type de courrier' });
    }
};

export const deleteTypeCourrierController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await TypeCourrier.destroy({
            where: {
                id_type_courrier: id
            }
        });
        if (deletedRows === 0) {
            return res.status(400).json({ message: "Type de courrier non trouvée, Aucune suppression effectuée" });
        }
        res.status(200).json({ message: 'Type de courrier supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du type de courrier' });
    }
};
