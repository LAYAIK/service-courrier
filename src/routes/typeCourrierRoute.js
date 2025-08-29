/**
 * @swagger
 * components:
 *   schemas:
 *     TypeCourrier:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           description: Le libellé du type de courrier
 *         description:
 *           type: string
 *           description: Une description optionnelle du type de courrier
 *       required:
 *         - type
 *         - description
 *       example:
 *         id: '123e4567-e89b-12d3-a456-426614174000'
 *         type: "entrant"
 *         description: "Courrier entrant"
 */

/**
 * @swagger
 * /api/typecourriers:
 *   get:
 *     summary: Récupérer tous les types de courriers
 *     tags: [TypeCourriers]
 *     responses:
 *       200:
 *         description: Liste de tous les types de courriers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TypeCourrier'
 *   post:
 *     summary: Créer un nouveau type de courrier
 *     tags: [TypeCourriers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeCourrier'
 *     responses:
 *       201:
 *         description: Type de courrier créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeCourrier'
 *       400:
 *         description: Le libellé est requis
 *       500:
 *         description: Erreur lors de la création du type de courrier
 * 
 * /api/typecourriers/{id}:
 *   get:
 *     summary: Récupérer un type de courrier par ID
 *     tags: [TypeCourriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du type de courrier
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Type de courrier trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeCourrier'
 *       404:
 *         description: Type de courrier non trouvé
 *       500:
 *         description: Erreur lors de la récupération du type de courrier
 *   put:
 *     summary: Mettre à jour un type de courrier par ID
 *     tags: [TypeCourriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du type de courrier
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeCourrier'
 *     responses:
 *       200:
 *         description: Type de courrier mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeCourrier'
 *       404:
 *         description: Type de courrier non trouvé
 *       400:
 *         description: Tous les champs sont requis
 *       500:
 *         description: Erreur lors de la mise à jour du type de courrier
 *   delete:
 *     summary: Supprimer un type de courrier par ID
 *     tags: [TypeCourriers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du type de courrier
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Type de courrier supprimé avec succès
 *       404:
 *         description: Type de courrier non trouvé
 *       500:
 *         description: Erreur lors de la suppression du type de courrier
 */
import express from "express";
import { getAllTypeCourriersController, createTypeCourrierController, getTypeCourrierByIdController, updateTypeCourrierController, deleteTypeCourrierController } from "../controllers/typeCourrierController.js";
const router = express.Router();
router.route("/api/typecourriers")
    .get(getAllTypeCourriersController) // Récupérer tous les types de courriers
    .post(createTypeCourrierController); // Créer un nouveau type de courrier

router.route("/api/typecourriers/:id")   
    .get(getTypeCourrierByIdController) // Récupérer un type de courrier par ID
    .put(updateTypeCourrierController) // Mettre à jour un type de courrier par ID
    .delete(deleteTypeCourrierController); // Supprimer un type de courrier par ID


const TypeCourrierRoutes = router;

export default TypeCourrierRoutes;
