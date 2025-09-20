import { getAllHistoriqueCourriers } from "../controllers/historiqueCourrierController.js";
import express from "express";

/**
 * @swagger
 * 
 * tags: 
 *  - name: Historique
 *    description: le model de la table 
 * composants:
 *  schemas:
 *     Historique:
 *       type: object
 *       properties:
 *         id_historique:
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
 *         id_historique: "123e4567-e89b-12d3-a456-426614174000"
 *         description: "Archive de test"
 *         date_archivage: "2023-01-01T00:00:00.000Z"
 *         id_utilisateur: "123e4567-e89b-12d3-a456-426614174001"
 *         id_courrier: "123e4567-e89b-12d3-a456-426614174002"
 * 
 * 
 * /api/getAllHistoriqueCourriers:
 *   get:
 *     summary: Récupère tous les historiques de courriers
 *     tags:
 *       - HistoriqueCourriers
 *     responses:
 *       200:
 *         description: Liste des historiques de courriers récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Historique'
 *       500:
 *         description: Erreur serveur
 */

const router = express.Router();
    router.get("/api/getAllHistoriqueCourriers", getAllHistoriqueCourriers);


const historiqueCourrierRoutes = router;
export default historiqueCourrierRoutes