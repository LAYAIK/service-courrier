import { getCouriersByStatus, getCouriersByMonth, getCouriersDailyTrend, exportCouriersToPdf,exportCouriersToCsv, getDetailedActivityReport } from "../controllers/rapportController.js";
import express from "express";

/**
 * @swagger
 * tags:
 *   - name: Rapports
 *     description: API pour les rapports d'activité des courriers et autres statistiques
 * /api/reports/stats/by-status:
 *   get:
 *     summary: Récupère le nombre de courriers groupés par statut
 *     description: Retourne une liste des statuts de courriers avec le nombre de courriers pour chaque statut.
 *     tags:
 *       - Rapports
 *     responses:
 *       200:
 *         description: Liste des statuts de courriers avec leur nombre respectif
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   statut:
 *                     type: string
 *                     description: Le statut du courrier
 *                   count:
 *                     type: integer
 *                     description: Nombre de courriers pour ce statut
 *       500:
 *         description: Erreur serveur lors de la récupération des courriers par statut
 *
 * 
 * /api/reports/stats/by-month:
 *   get:
 *     summary: Récupère le nombre de courriers groupés par mois et par année.
 *     description: Retourne une liste contenant, pour chaque mois et année, le nombre de courriers déposés.
 *     tags:
 *       - Rapports
 *     responses:
 *       200:
 *         description: Liste des courriers groupés par mois et année.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                     description: Année du dépôt du courrier.
 *                     example: 2024
 *                   month:
 *                     type: integer
 *                     description: Mois du dépôt du courrier.
 *                     example: 6
 *                   count:
 *                     type: integer
 *                     description: Nombre de courriers déposés ce mois-là.
 *                     example: 15
 *       500:
 *         description: Erreur lors de la récupération des courriers par mois.
 * 
 * /api/reports/stats/daily-trend:
 *   get:
 *     summary: Récupère la tendance quotidienne des courriers déposés.
 *     description: Retourne le nombre de courriers déposés par jour.
 *     tags:
 *       - Rapports
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Date de début pour filtrer les résultats (optionnel).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Date de fin pour filtrer les résultats (optionnel).
 *     responses:
 *       200:
 *         description: Liste des tendances quotidiennes des courriers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: string
 *                     format: date
 *                     description: Date du jour.
 *                   count:
 *                     type: integer
 *                     description: Nombre de courriers déposés ce jour-là.
 *       500:
 *         description: Erreur serveur lors de la récupération des tendances quotidiennes.
 *
 * /api/reports/export/pdf:
 *   get:
 *     summary: Exporte la liste des courriers filtrés/triés au format PDF.
 *     tags:
 *       - Rapports
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer les courriers (inclusif).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer les courriers (inclusif).
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Statut du courrier à filtrer.
 *       - in: query
 *         name: nature
 *         schema:
 *           type: string
 *         description: Nature du courrier à filtrer.
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         description: Terme de recherche pour filtrer les courriers.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Champ de tri (ex:"date_depot").
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri (ascendant ou descendant).
 *     responses:
 *       200:
 *         description: Un fichier PDF contenant la liste des courriers exportés.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Erreur lors de la génération du PDF.
 *
 * 
 * /api/reports/export/csv:
 *   get:
 *     summary: Exporte la liste des courriers filtrés au format CSV.
 *     description: |
 *       Permet d'exporter tous les courriers selon les critères de recherche et de filtrage spécifiés, au format CSV.
 *     tags:
 *       - Rapports
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début du filtre (inclus).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin du filtre (inclus).
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Statut du courrier à filtrer.
 *       - in: query
 *         name: nature
 *         schema:
 *           type: string
 *         description: Nature du courrier à filtrer.
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         description: Terme de recherche pour l'objet ou le numéro du courrier.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Champ de tri (ex:date_depot, objet, etc.).
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Ordre de tri (ASC ou DESC).
 *     responses:
 *       200:
 *         description: Fichier CSV généré avec succès.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Erreur lors de l'exportation du CSV.
 *
 *
 * /api/reports/detailed:
 *   get:
 *     summary: Génère un rapport détaillé des courriers avec filtres, recherche, tri et pagination.
 *     tags:
 *       - Rapports
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer la plage de dates de dépôt.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer la plage de dates de dépôt.
 *       - in: query
 *         name: serviceExpeditor
 *         schema:
 *           type: integer
 *         description: ID du service expéditeur pour filtrer les courriers.
 *       - in: query
 *         name: serviceRecipient
 *         schema:
 *           type: integer
 *         description: ID du service destinataire pour filtrer les courriers.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Statut du courrier à filtrer.
 *       - in: query
 *         name: nature
 *         schema:
 *           type: string
 *         description: Nature du courrier à filtrer.
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         description: Mot-clé pour rechercher dans l'objet ou le contenu du courrier.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Champ par lequel trier les résultats (ex:'date_depot', 'numero_courrier').
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Ordre de tri ('ASC' ou 'DESC').
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre maximum de résultats à retourner (pagination).
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Décalage pour la pagination.
 *     responses:
 *       200:
 *         description: Rapport détaillé généré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Nombre total de courriers correspondant aux filtres.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Courrier'
 *       500:
 *         description: Erreur lors de la génération du rapport détaillé.
 */


const router = express.Router();
    router.get("/api/reports/stats/by-status", getCouriersByStatus);
    router.get("/api/reports/stats/by-month", getCouriersByMonth);
    router.get("/api/reports/stats/daily-trend", getCouriersDailyTrend);
    router.get("/api/reports/export/pdf", exportCouriersToPdf);
//  router.get("/api/reports/export/xlsx", exportCouriersToXlsx);
    router.get("/api/reports/export/csv", exportCouriersToCsv);
    router.get("/api/reports/detailed", getDetailedActivityReport);

const rapportRoutes = router;
export default rapportRoutes;