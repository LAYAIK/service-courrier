/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Crée un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle:
 *                 type: string
 *                 description: Libellé du document
 *                 example: "Document Example"
 *               description:
 *                 type: string
 *                 description: Description du document
 *                 example: "Description du document"
 *               id_courrier:
 *                 type: string
 *                 format: uuid
 *                 description: ID du courrier lié au document
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *               id_type_document:
 *                 type: string
 *                 format: uuid
 *                 description: ID du type de document
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *               id_archive:
 *                 type: string
 *                 format: uuid
 *                 description: ID de l'archive lié au document
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       201:
 *         description: Document créé
 *       400:
 *         description: Erreur lors de la création du document
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Récupère la liste des documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Récupère un document par son ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du document
 *     responses:
 *       200:
 *         description: Document trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Document non trouvé
 */

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Met à jour un document
 *     tags: [Documents]
 *     description: |
 *        Met à jour les informations d'un document spécifique.
 *        **Autorisation :**
 *           - Nécessite la permission de base : `document.modifier`.
 *           - **Exigences de Scope (déduites du statut du document) :**
 *           - Si le document est en statut `brouillon`, l'utilisateur doit avoir le scope implicite `document:statut:brouillon`.
 *           - Si le document est en statut `publie`, l'utilisateur doit avoir le scope implicite `document:statut:publie`.
 *           - Un utilisateur avec la permission `document.modifier` ne peut modifier un document que si son statut correspond à un des scopes autorisés pour cette permission (tel que défini dans `PERMISSION_SCOPE_REQUIREMENTS` côté serveur).
 *           - Si le statut du document ne correspond à aucun scope autorisé pour `document.modifier`, l'accès sera refusé (403).  
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle:
 *                 type: string
 *                 description: Libellé du document
 *                 example: "Document Example"
 *               description:
 *                 type: string
 *                 description: Description du document
 *                 example: "Description du document"
 *               id_courrier:
 *                 type: string
 *                 format: uuid
 *                 description: ID du courrier lié au document
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *               id_type_document:
 *                 type: string
 *                 format: uuid
 *                 description: ID du type de document
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *               id_archive:
 *                 type: string
 *                 format: uuid
 *                 description: ID de l'archive lié au document
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Document mis à jour
 *       400:
 *         description: Erreur lors de la mise à jour du document
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Document non trouvé
 */

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Supprime un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du document
 *     responses:
 *       204:
 *         description: Document supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Document non trouvé
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id_document:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du document
 *         libelle:
 *           type: string
 *           description: Libellé du document
 *         description:
 *           type: string
 *           description: Description du document
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création du document
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour du document
 *       required:
 *         - id_document
 *         - libelle
 *       example:
 *         id_document: "123e4567-e89b-12d3-a456-426614174000"
 *         libelle: "Document Example"
 *         description: "Description de l'exemple de document"
 *         createdAt: "2023-10-01T12:00:00Z"
 *         updatedAt: "2023-10-01T12:00:00Z"
 */

/**
 * @swagger
 * /api/documents/search:
 *   get:
 *     summary: Rechercher des documents par mot-clé
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Mot-clé de recherche
 *     responses:
 *       200:
 *         description: Documents trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun document trouvé
 */

import express from 'express';
import {
    getAllDocumentsController,
    createDocumentController,
    getDocumentByIdController,
    updateDocumentController,
    deleteDocumentController,
    searchDocumentsController,
    viewDocumentController

} from '../controllers/documentController.js';
import { authenticateToken} from '../middlewares/authMiddleware.js';
import authorizeWithScopes from '../middlewares/authorizationWithScopes.js';
import modifierDocumentMiddleware from '../middlewares/modifierDocumentMiddleware.js';
import supprimerDocumentMiddleware from '../middlewares/supprimerDocumentMiddleware.js';

const router = express.Router();

router.route('/api/documents')
    .get(getAllDocumentsController)
    .post(authenticateToken, authorizeWithScopes('document.creer'), createDocumentController);

router.route('/api/documents/:id')
    .get(
        // authenticateToken, authorizeWithScopes('document.lire'), 
    getDocumentByIdController)

    // L'utilisateur veut modifier un document. Le scope dépend du statut du document avec le middleware 'modifierDocumentMiddleware'.
    .put(authenticateToken, modifierDocumentMiddleware, updateDocumentController)
    // L'utilisateur veut supprimer un document. Le scope depend du statut et archivé du document avec le middleware 'supprimerDocumentMiddleware'.
    .delete( deleteDocumentController);

router.route('/api/documents/search')
    .get(authenticateToken, authorizeWithScopes('document.lire'), searchDocumentsController);

router.route('/api/documents/:id/view')
    .get( viewDocumentController);


// const router = express.Router();

// router.route('/api/documents')
//     .get( getAllDocumentsController)
//     .post(createDocumentController);

// router.route('/api/documents/search')
//     .get( searchDocumentsController);


// router.route('/api/documents/:id')
//     .get(getDocumentByIdController)
//     .put(updateDocumentController)
//     .delete(deleteDocumentController);



const documentRoutes = router;
export default documentRoutes;
