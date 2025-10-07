import { createArchive, getAllArchives, getArchiveById, updateArchive, deleteArchive, searchArchives } from "../controllers/archiveController.js";
import express from "express";


/**
 * @fileOverview Route pour les archives
 * @author Firstname Lastname
 */

/** 
 * @swagger
 * tags:
 *   - name: Archives
 *     description: Gestion des archives
 * components:
 *   schemas:
 *     Archive:
 *       type: object
 *       properties:
 *         id_archive:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 *         date_archivage:
 *           type: date
 *           format: date-time
 *         id_utilisateur:
 *           type: string
 *           format: uuid
 *         id_courrier:
 *           type: string
 *           format: uuid
 *       required:
 *         - description
 *       example:
 *         id_archive: "123e4567-e89b-12d3-a456-426614174000"
 *         description: "Archive de test"
 *         date_archivage: "2023-01-01T00:00:00.000Z"
 *         id_utilisateur: "123e4567-e89b-12d3-a456-426614174001"
 *         id_courrier: "123e4567-e89b-12d3-a456-426614174002"
 * 
 * /api/archives:
 *   get:
 *     summary: Récupérer toutes les archives du système
 *     tags: [Archives]
 *     responses:
 *       200:
 *         description: Liste de toutes les archives
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archive'
 *       500:
 *         description: Erreur lors de la récupération des archives
 *   post: 
 *     summary: Créer une nouvelle archive du système
 *     tags: [Archives] 
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Archive' 
 *     responses:
 *       201:
 *         description: Archive crée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archive'
 *       400: 
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur lors de la crée de l'archive
 * 
 * /api/archives/search: 
 *   get:
 *     summary: Rechercher des archives par mot-clé
 *     tags: [Archives]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Mot-clé de recherche
 *         schema:
 *           type: string
 *           example: "Information"
 *     responses:
 *       200:
 *         description: Archives trouvées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archive'
 *       500:
 *         description: Erreur lors de la recherche des archives par mot-clé
 * 
 * /api/archives/{id}:
 *   get: 
 *     summary: Récupérer une archive par ID
 *     tags: [Archives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'archive
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Archive trouvée 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archive'
 *       404: 
 *         description: Archive non trouvée
 *       500:
 *         description: Erreur lors de la recherche de l'archive
 *   put:
 *     summary: Mettre à jour une archive par ID
 *     tags: [Archives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'archive à mettre à jour
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Archive'
 *     responses:
 *       200:
 *         description: Archive mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archive'
 *       404:
 *         description: Archive non trouvée
 *       500:
 *         description: Erreur lors de la mise à jour de l'archive
 *   delete: 
 *     summary: Supprimer une archive par ID
 *     tags: [Archives]
 *     parameters: 
 *       - in: path
 *         name: id 
 *         required: true
 *         description: ID de l'archive à supprimer
 *         schema: 
 *           type: string
 *           format: uuid 
 *     responses:
 *       200:
 *         description: Archive supprimée avec succès
 *       404: 
 *         description: Archive non trouvée
 *       500:
 *         description: Erreur lors de la suppression de l'archive
 */ 
import multer from 'multer';

const router = express.Router();

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/'); // The directory where files will be saved
    },
    filename: (_, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });
router.route('/api/archives')
    .get(getAllArchives)
    .post( upload.array('fichiers'),createArchive);

router.route('/api/archives/search')
    .get(searchArchives);

router.route('/api/archives/:id')
    .get(getArchiveById)
    .put(updateArchive)
    .delete(deleteArchive);

const archiveRoutes = router;
export default archiveRoutes