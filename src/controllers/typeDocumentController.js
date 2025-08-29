import db from '../models/index.js';
const { TypeDocument } = db;

// Create a new TypeDocument
export const createTypeDocumentController = async (req, res) => {
    try {
        const { type, description } = req.body;
        if (!type) {
            return res.status(400).json({ message: 'le type est requis' });
        }
        const typeDocument = await TypeDocument.create({ type });
        if (description) typeDocument.description = description;
        await typeDocument.save();
        res.status(201).json({ message: 'TypeDocument creer avec success', typeDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la creation du TypeDocument' });
    }
};

// Get all TypeDocuments
export const getAllTypeDocumentsController = async (req, res) => {
    try {
        const typeDocuments = await TypeDocument.findAll();
        if (typeDocuments.length === 0) {
            return res.status(404).json({ message: 'Ya aucun TypeDocument' });
        }
        res.status(200).json(typeDocuments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recuperation des TypeDocuments' });
    }
};

// Get a TypeDocument by ID
export const getTypeDocumentByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const typeDocument = await TypeDocument.findByPk(id);
        if (!typeDocument) {
            return res.status(404).json({ message: 'TypeDocument non trouvé' });
        }
        res.status(200).json(typeDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recuperation du TypeDocument' });
    }
};

// Update a TypeDocument by ID
export const updateTypeDocumentController = async (req, res) => {
    try {
        const id = req.params.id;
        const { type, description } = req.body;
        const typeDocument = await TypeDocument.findByPk(id);
        if (!typeDocument) {
            return res.status(404).json({ message: 'TypeDocument non trouvé' });
        }
        if (type) typeDocument.type = type;
        if (description) typeDocument.description = description;
        await typeDocument.save();
        const updatedTypeDocument = await TypeDocument.findByPk(id);
        res.status(200).json({ message: 'TypeDocument mis à jour avec succès', updatedTypeDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ereur lors de la mise à jour du TypeDocument' });
    }
};

// Delete a TypeDocument by ID
export const deleteTypeDocumentController = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRows = await TypeDocument.destroy({ where: { id_type_document: id } });
        if (deletedRows === 0) {
            return res.status(400).json({ message: 'Aucune suppression effectuée' });
        }
        res.status(200).json({ message: 'TypeDocument supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du TypeDocument' });
    }
};

