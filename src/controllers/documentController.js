import db from '../models/index.js';
const { Document } = db;
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export const createDocumentController = async (req, res) => {
    try {
        const {id_type_document, id_courrier, description,id_archive } = req.body;
        const fichierTelecharger = req.file; // Récupérer le fichier téléchargé

        if ( !id_type_document) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const document = await Document.create({id_type_document});
        if (id_courrier) document.id_courrier = id_courrier;
        if (description) document.description = description;
        if (id_archive) document.id_archive = id_archive;
        await document.save();
        const fichiersauvegarder = fichierTelecharger.map(file => ({
            libelle: file.originalname,
            chemin_serveur: file.path,
            type_mime: file.mimetype,
            taille: file.size,
            id_document: document.id_document
        }));
        await Document.bulkCreate(fichiersauvegarder);
        res.status(201).json({ message: 'Document créé avec succès', document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du document' });
    }
};

export const getAllDocumentsController = async (req, res) => {
    try {
        const documents = await Document.findAll();
        if (documents.length === 0) {
            return res.status(404).json({ message: 'Aucun document trouvé' });
        }
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des documents' });
    }
};

// export const getDocumentByIdController = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const document = await Document.findByPk(id);
//         if (!document) {
//             return res.status(404).json({ message: 'Document non trouvé' });
//         }
//         res.status(200).json(document);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la récupération du document' });
//     }
// };

export const updateDocumentController = async (req, res) => {
    try {
        const id = req.params.id;
        const { libelle, id_type_document, id_courrier, description,id_archive } = req.body;

        const document = await Document.findByPk(id);
        if (!document) {
            return res.status(404).json({ message: 'Document non trouvé' });
        }
        if (libelle) document.libelle = libelle;
        if (id_type_document) document.id_type_document = id_type_document;
        if (id_courrier) document.id_courrier = id_courrier;
        if (description) document.description = description;
        if (id_archive) document.id_archive = id_archive;
        await document.save();
        const updatedDocument = await Document.findByPk(id);
        res.status(200).json({ message: 'Document mis à jour avec succès', updatedDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du document' });
    }
};

export const deleteDocumentController = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRows = await Document.destroy({ where: { id_document: id } });
        if (deletedRows === 0) {
            return res.status(400).json({ message: 'Aucune suppression effectuée' });
        }
        res.status(200).json({ message: 'Document supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du document' });
    }
};
export const searchDocumentsController = async (req, res) => {
    try {
        const { query } = req.query; // Renommer 'id' en 'query' pour plus de clarté
        let filter = {};

        if (!query) {
            return res.status(400).json({ message: 'Un terme de recherche est requis (paramètre "query").' });
        }

        // Regex pour valider un UUID
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        // Si la chaîne de requête ressemble à un UUID, tentez de rechercher par ID
        if (uuidRegex.test(query)) {
            filter = {
                [Op.or]: [
                    { id_document: query }, // Recherche exacte par UUID
                    { id_courrier: query },
                    { id_archive: query },
                    { id_type_document: query }
                ]
            };
        } else {
            filter = {
                [Op.or]: [
                    { libelle: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } }
                ]
            };
        }

        const documents = await Document.findAll({ where: filter });

        if (documents.length === 0) {
            return res.status(404).json({ message: 'Aucun document trouvé pour le terme de recherche.' });
        }

        res.status(200).json({ message: `Documents trouvés pour '${query}'`, documents }); // Utilisation de 'query'
    } catch (error) {
        console.error('Erreur lors de la recherche de documents :', error); 
        if (error.name === 'SequelizeDatabaseError' && error.original && error.original.code === '22P02') {
            return res.status(400).json({ message: 'Erreur de format de recherche : l\'ID fourni n\'est pas un UUID valide.' });
        }
        res.status(500).json({ message: 'Erreur interne du serveur lors de la recherche de documents.' });
    }
};

// telechargrement de fichier
export const getDocumentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Récupérer infos du document en base
    const doc = await Document.findByPk(id);
    if (!doc) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    // 2. Construire le chemin absolu vers le fichier
    const filePath = path.resolve(doc.chemin_serveur); // chemin_serveur stocké en DB

    // 3. Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier introuvable sur le serveur" });
    }

    // 4. Télécharger le fichier
    res.download(filePath, doc.libelle || "document", (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
        console.log("Erreur lors du téléchargement :", err);
        console.log("Chemin du fichier :", filePath);
        res.status(500).json({ message: "Erreur lors du téléchargement du fichier" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const viewDocumentController =  async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Récupérer infos du document
    const doc = await Document.findByPk(id);
    if (!doc) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    // 2. Construire le chemin absolu
    const filePath = path.resolve(doc.chemin_serveur);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier introuvable" });
    }

    // 3. Déterminer le type MIME
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    // 4. Envoyer le fichier pour affichage (pas téléchargement)
    res.setHeader("Content-Type", mimeType);
    fs.createReadStream(filePath).pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
