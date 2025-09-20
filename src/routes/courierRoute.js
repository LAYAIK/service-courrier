import { createCourier, deleteCourier, getAllCouriers, getCourierById, searchCouriers, updateCourier, transfertCourier } from "../controllers/courierController.js";
import express from "express";
import multer from 'multer';

/**
 * @fileOverview Route pour les courriers
 * @author Firstname Lastname
 */

/** 
 * @swagger
 * tags:
 *   - name: Courriers
 *     description: Gestion des courriers
 * components:
 *   schemas:
 *     Courier:
 *       type: object
 *       properties:
 *         id_courrier:
 *           type: string
 *           format: uuid
 *         id_objet:
 *           type: string
 *         date_envoi:
 *           type: string
 *           format: date-time
 *         numero_courrier:
 *           type: string
 *         id_archive:
 *           type: string
 *         id_expediteur:
 *           type: string
 *           format: uuid
 *         id_type_courrier:
 *           type: string
 *         date_reception:
 *           type: string
 *           format: date-time
 *         est_archive:
 *           type: boolean
 *         documents_associes:
 *           type: string
 *         id_structure:
 *           type: string
 *           format: uuid
 *         id_priorite:
 *           type: string
 *         id_status:
 *           type: string
 *         date_archivage:
 *           type: string
 *           format: date-time
 *         date_traitement: 
 *           type: string
 *           format: date-time
 *       required:
 *         - objet
 *         - numero_courrier
 *         - id_expediteur
 *         - contenu
 *       example:
 *         id_objet: "02475852-b4c5-4514-8f46-08ea1c60510b"
 *         date_envoi: "2023-10-01T12:00:00Z"
 *         numero_courrier: "C123456789"
 *         nature: "Entrant"
 *         id_type_courrier: "02475852-b4c5-4514-8f46-08ea1c60510b"
 *         est_archive: false
 *         documents_associes: "123e4567-e89b-12d3-a456-426614174002"
 *         id_structure: "123e4567-e89b-12d3-a456-426614174005"
 *         contenu: "Bonjour, je suis un courrier."
 *         id_priorite: "02475852-b4c5-4514-8f46-08ea1c60510b"
 *         id_status: "02475852-b4c5-4514-8f46-08ea1c60510b"
 *         date_archivage: "2023-10-01T12:00:00Z"
 *         date_traitement: "2023-10-01T12:00:00Z"
 *         date_reception: "2023-10-01T12:00:00Z"
 */

/** 
 * @swagger
 * tags:
 *   - name: HistoriqueCourriers
 *     description: Gestion des historiques de courriers
 * components:
 *   schemas:
 *     HistoriqueCourrier:
 *       type: object
 *       properties:
 *         id_historique:
 *           type: string
 *           format: uuid
 *         id_courrier:
 *           type: string
 *           format: uuid
 *         id_utilisateur:
 *           type: string
 *           format: uuid
 *         id_structure:
 *          type: string
 *          format: uuid
 *         date_historique:
 *           type: string
 *           format: date-time
 *         action: 
 *           type: string
 *       required:
 *         - id_courrier
 *         - id_utilisateur
 *       example:
 *         id_courrier: "123e4567-e89b-12d3-a456-426614174000"
 *         id_utilisateur: "123e4567-e89b-12d3-a456-426614174001"
 *         id_structure: "123e4567-e89b-12d3-a456-426614174002"
 *         date_historique: "2023-10-01T12:00:00Z"
 *         action: "Transfert"
 *
 * @swagger
 * /api/couriers:
 *   get:
 *     summary: Récupérer tous les courriers
 *     tags: [Courriers]
 *     responses:
 *       200:
 *         description: Liste de tous les courriers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Courier'
 *   post:
 *     summary: Créer un nouveau courrier
 *     tags: [Courriers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Courier'
 *     responses:
 *       201:
 *         description: Courrier créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courier'
 *       400: 
 *         description: Tous les champs sont requis ou utilisateur existant
 *       500:
 *         description: Erreur lors de la création du courrier 
 * 
 * /api/couriers/{id}:
 *   get: 
 *     summary: Récupérer un courrier par ID
 *     tags: [Courriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du courrier
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Courrier trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courier'
 *       404:
 *         description: Courrier non trouvé
 *       500:
 *         description: Erreur lors de la recherche du courrier
 *   put:
 *     summary: Mettre à jour un courrier par ID
 *     tags: [Courriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du courrier
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Courier'
 *     responses:
 *       200:
 *         description: Courrier mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courier'
 *       404:
 *         description: Courrier non trouvé
 *       400:
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur lors de la mise à jour du courrier
 *   delete:
 *     summary: Supprimer un courrier par ID
 *     tags: [Courriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du courrier
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Courrier supprimé avec succès
 *       404:
 *         description: Courrier non rencontré
 *       500:
 *         description: Erreur lors de la suppression du courrier
 * 
 * /api/couriers/search:
 *   get:
 *     summary: Rechercher des courriers par mot-clé ou date
 *     tags: [Courriers]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Mot-clé ou date de recherche
 *         schema:
 *           type: string
 *           example: "Information"
 *     responses:
 *       200:
 *         description: Courriers trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Courier'
 *       500:
 *         description: Erreur lors de la recherche des courriers par mot-clé 
 * 
 * /api/couriers/{id}/transfert:
 *   put:
 *     summary: Transférer un courrier à une autre structure
 *     tags: [Courriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du courrier à transférer
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_structure_nouveau: 
 *                 type: string
 *                 format: uuid
 *                 description: ID de la nouvelle structure
 *               id_utilisateur_transfert:
 *                 type: string
 *                 format: uuid
 *                 description: ID de l'utilisateur transférant le courrier
 *               id_status:
 *                 type: string
 *                 format: uuid
 *                 description: ID du statut du courrier après transfert
 *             required:
 *               - id_structure_nouveau
 *               - id_utilisateur_transfert
 *               - id_status
 *     responses:
 *       200:
 *         description: Courrier transféré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courier'
 *       404:
 *         description: Courrier non rencontré
 *       400:
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur lors du transfert du courrier
 */
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

router.route("/api/couriers")
.get(getAllCouriers) // Récupérer tous les courriers
.post( upload.array('fichiers'),createCourier); // Créer un nouveau courrier

router.route("/api/couriers/search")
    .get(searchCouriers); // Rechercher des courriers par mot-clé

router.route("/api/couriers/:id")   
    .get(getCourierById) // Récupérer un courrier par ID
    .put(upload.array('fichiers'),updateCourier) // Mettre à jour un courrier par ID
    .delete(deleteCourier); // Supprimer un courrier par ID

router.route("/api/couriers/:id/transfert")
    .put(upload.array('fichiers'),transfertCourier)





const courierRoutes = router;
export default courierRoutes