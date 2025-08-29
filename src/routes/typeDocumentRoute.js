/**
 * @swagger
 * /api/typedocuments:
 *   post:
 *     summary: Crée un type de document
 *     tags: [TypeDocuments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Libellé du type de document
 *                 example: "pdf"
 *               description:
 *                 type: string
 *                 description: Description du type de document
 *                 example: "Description du type de document"
 *     responses:
 *       201:
 *         description: Type de document créé
 *       400:
 *         description: Erreur lors de la création du type de document
 *       401:
 *         description: Non autorisé
 */
/**
 * @swagger
 * /api/typedocuments:
 *   get:
 *     summary: Récupère la liste des types de documents
 *     tags: [TypeDocuments]
 *     responses:
 *       200:
 *         description: Liste des types de documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TypeDocument'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun type de document trouvé
 *       500:
 *         description: Erreur lors de la recherche des types de documents
 */

/**
 * @swagger
 * /api/typedocuments/{id}:
 *   get:
 *     summary: Récupère un type de document par son ID
 *     tags: [TypeDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du type de document
 *     responses:
 *       200:
 *         description: Type de document trouvé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Type de document non trouvé
 */

/**
 * @swagger
 * /api/typedocuments/{id}:
 *   put:
 *     summary: Met à jour un type de document
 *     tags: [TypeDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du type de document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Libellé du type de document
 *                 example: "Type document mis à jour"
 *               description:
 *                 type: string
 *                 description: Description du type de document
 *                 example: "Description du type de document mis à jour"
 *     responses:
 *       200:
 *         description: Type de document mis à jour
 *       400:
 *         description: Erreur lors de la mise à jour du type de document
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Type de document non trouvé
 */

/**
 * @swagger
 * /api/typedocuments/{id}:
 *   delete:
 *     summary: Supprime un type de document
 *     tags: [TypeDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID du type de document
 *     responses:
 *       204:
 *         description: Type de document supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Type de document non trouvé
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     TypeDocument:
 *       type: object
 *       properties:
 *         id_type_document:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du type de document
 *         type:
 *           type: string
 *           description: Libellé du type de document
 *         description:
 *           type: string
 *           description: Description du type de document
 *       required:
 *         - id_type_document
 *         - type
 *       example:
 *         id_type_document: "123e4567-e89b-12d3-a456-426614174000"
 *         type: "pdf"
 *         description: "Description du type de document"
 */

import express from 'express';
const router = express.Router();

import {
    getAllTypeDocumentsController,
    createTypeDocumentController,
    getTypeDocumentByIdController,
    updateTypeDocumentController,
    deleteTypeDocumentController,
} from "../controllers/typeDocumentController.js";

router.route('/api/typedocuments')
    .get(getAllTypeDocumentsController)
    .post(createTypeDocumentController);

router.route('/api/typedocuments/:id')
    .get(getTypeDocumentByIdController)
    .put(updateTypeDocumentController)
    .delete(deleteTypeDocumentController);

const typeDocumentRoutes = router;
export default typeDocumentRoutes
