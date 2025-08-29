/**
 * @swagger
 * components:
 *   schemas:
 *     CourrierUtilisateur:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: L'identifiant unique du courrier utilisateur
 *         id_courrier:
 *           type: string
 *           format: uuid
 *           description: L'identifiant du courrier
 *         id_utilisateur:
 *           type: string
 *           format: uuid
 *           description: L'identifiant de l'utilisateur
 *         id_destinataire:
 *           type: string
 *           format: uuid
 *           description: L'identifiant du destinataire
 *         date_transmission:
 *           type: string
 *           format: date-time
 *           description: La date de transmission du courrier
 *         date_reception:
 *           type: string
 *           format: date-time
 *           description: La date de réception du courrier
 *         date_traitement:
 *           type: string
 *           format: date-time
 *           description: La date de traitement du courrier
 *       required:
 *         - id_courrier
 *         - id_utilisateur
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         id_courrier: "123e4567-e89b-12d3-a456-426614174001"
 *         id_utilisateur: "123e4567-e89b-12d3-a456-426614174002"
 *         id_destinataire: "123e4567-e89b-12d3-a456-426614174003"
 *         date_transmission: "2023-10-01T12:00:00Z"
 *         date_reception: "2023-10-02T12:00:00Z"
 *         date_traitement: "2023-10-03T12:00:00Z"
 */

/**
 * @swagger
 * /api/courriers-utilisateurs:
 *   get:
 *     summary: Récupérer tous les courriers utilisateurs
 *     tags: [Courriers-Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste de tous les courriers utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourrierUtilisateur'
 *   post:
 *     summary: Créer un nouveau courrier utilisateur
 *     tags: [Courriers-Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourrierUtilisateur'
 *     responses:
 *       201:
 *         description: Courrier utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourrierUtilisateur'
 *       400: 
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur lors de la création du courrier utilisateur
 * 
 * /api/courriers-utilisateurs/{id}:
 *   get:
 *     summary: Récupérer un courrier utilisateur par ID
 *     tags: [Courriers-Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: L'identifiant unique du courrier utilisateur
 *     responses:
 *       200:
 *         description: Courrier utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourrierUtilisateur'
 *       404:
 *         description: Courrier utilisateur non trouvé
 *   put:
 *     summary: Mettre à jour un courrier utilisateur
 *     tags: [Courriers-Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: L'identifiant unique du courrier utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourrierUtilisateur'
 *     responses:
 *       200:
 *         description: Courrier utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourrierUtilisateur'
 *       400: 
 *         description: Tous les champs sont requis
 *       404:
 *         description: Courrier utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du courrier utilisateur
 *   delete:
 *     summary: Supprimer un courrier utilisateur
 *     tags: [Courriers-Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: L'identifiant unique du courrier utilisateur
 *     responses:
 *       204:
 *         description: Courrier utilisateur supprimé avec succès
 *       404:
 *         description: Courrier utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la suppression du courrier utilisateur 
 */

import express from "express";
import { getAllCourrierUtilisateursController, createCourrierUtilisateurController, getCourrierUtilisateurByIdController, updateCourrierUtilisateurController, deleteCourrierUtilisateurController } from "../controllers/courrierUtilisateurController.js";

const router = express.Router();

router.route('/api/courriers-utilisateurs')
    .get(getAllCourrierUtilisateursController) // Récupérer tous les courriers utilisateurs
    .post(createCourrierUtilisateurController); // Créer un nouveau courrier utilisateur

router.route('/api/courriers-utilisateurs/:id')
    .get(getCourrierUtilisateurByIdController) // Récupérer un courrier utilisateur par ID
    .put(updateCourrierUtilisateurController) // Mettre à jour un courrier utilisateur par ID
    .delete(deleteCourrierUtilisateurController); // Supprimer un courrier utilisateur par ID

const CourrierUtilisateurRoutes = router;
export default CourrierUtilisateurRoutes

