import db from '../models/index.js';
import authorizeWithScopes from './authorizationWithScopes.js';

 const supprimerDocumentMiddleware = async (req, res, next) => {
    const documentId = req.params.id;
    const document = await db.Document.findByPk(documentId);

    if (!document) {
        return res.status(404).json({ message: 'Document non trouvé.' });
    }

    let scopeRequired = null;
    if (document.statut === 'archive') {
        scopeRequired = 'document:statut:archive';
    }

    // Appelle 'authorizeWithScopes' avec la permission 'document.supprimer'
    // et le scope contextuel 'document:statut:archive' (si le document est archivé).
    authorizeWithScopes('document.supprimer', scopeRequired)(req, res, next);
}

export default supprimerDocumentMiddleware