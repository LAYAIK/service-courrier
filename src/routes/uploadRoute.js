import express from 'express';
import uploadController from '../controllers/uploadController.js';
import upload from '../middlewares/uploadFileMiddleware.js';


const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload un fichier
 *     tags: [Upload Fichier]
 *     description: Upload un fichier vers le serveur
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               myFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier upload 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileInfo:
 *                   type: object
 *                   properties:
 *                     originalname:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     mimetype:
 *                       type: string
 *                     description:
 *                       type: string
 *                     serverPath:
 *                       type: string
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autoris 
 *       500:
 *         description: Erreur serveur
 */

router.post('/api/upload', upload.single('myFile'), uploadController.uploadFile);


const uploadRoutes = router;
export default uploadRoutes