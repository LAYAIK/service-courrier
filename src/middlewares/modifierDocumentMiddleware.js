import authorizeWithScopes from './authorizationWithScopes.js';
import db from '../models/index.js';

const modifierDocumentMiddleware = async (req, res, next) => {

    const documentId = req.params.id; // Récupère l'ID du document depuis l'URL
    const document = await db.Document.findByPk(documentId); // Récupère le document pour connaître son statut

    if (!document) {
        return res.status(404).json({ message: 'Document non trouvé.' });
    }
    const status = await db.Status.findByPk(document.id_status);

    let scopeRequired = null; // Initialise le scope requis à null
    if (status.libelle === 'brouillon') {
        scopeRequired = 'document:id_status:id_status'; // Si c'est un brouillon, ce scope est le contexte
    } else if (status.libelle === 'publie') {
        scopeRequired = 'document:id_status:id_status'; // Si c'est publié, ce scope est le contexte
    }
    // Vous pouvez ajouter d'autres conditions pour d'autres statuts ou propriétés du document

    // Le '.next()' est implicite ici, car 'authorizeWithScopes' appellera lui-même 'next()' si l'autorisation réussit.
    authorizeWithScopes('document.modifier', scopeRequired)(req, res, next);
};

export default modifierDocumentMiddleware;