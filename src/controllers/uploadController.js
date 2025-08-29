import db from '../models/index.js';

const uploadController = {

    uploadFile: async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({ message: 'Aucun fichier n\'a été uploadé ou le fichier est invalide.' });
            }
            // Informations sur le fichier uploadé (fournies par Multer dans req.file)

            const { originalname, mimetype, size, filename, path: filePath } = req.file;
            const description = req.body.description; // Récupère la description ou d'autres champs du formulaire

            console.log('Fichier uploadé et prêt à être traité :', {
                originalname,
                mimetype,
                size: `${(size / (1024 * 1024)).toFixed(2)} MB`,
                filename, 
                filePath: filePath, 
                description 
            });

            // --- Mettre à jour la base de données
            try {
                
                const newDbEntry = await db.Document.create({
                    libelle: description || originalname, 
                    chemin_serveur: filename, 
                    type_mime: mimetype,
                    taille: size,
                    
                    // id_utilisateur: req.user.id // Si l'utilisateur est authentifié
                });
                console.log('Enregistrement en base de données réussi :', newDbEntry.toJSON());
            } catch (dbError) {
                console.error('Erreur lors de l\'enregistrement en base de données :', dbError);
                 fs.unlinkSync(filePath); // Supprime le fichier du serveur si l'enregistrement en base de données echoue
                return res.status(500).json({ message: 'Erreur lors de l\'enregistrement des informations du fichier en base de données.' });
            }
            // Chemin public pour accéder au fichier (pour le client)
            const publicFilePath = `/uploads/${filename}`;

            // --- Réponse au Client ---
            res.status(200).json({
                message: 'Fichier uploadé et traité avec succès !',
                fileInfo: {
                    originalname,
                    filename, // Le nom sous lequel il est stocké sur le serveur
                    size,
                    mimetype,
                    description
                },
                filePath: publicFilePath // L'URL que le client peut utiliser pour voir le fichier
            });

        } catch (error) {
            console.error('Erreur inattendue dans le contrôleur d\'upload :', error);
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({ message: 'Le fichier est trop volumineux. La taille maximale est de 5 MB.' });
                }
                return res.status(400).json({ message: `Erreur d'upload (Multer) : ${error.message}` });
            }
            res.status(500).json({ message: 'Une erreur interne du serveur est survenue lors du traitement de l\'upload.' });
        }
    }
};

export default uploadController;
