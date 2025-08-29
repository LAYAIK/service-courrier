import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des ID uniques
import path from 'node:path';
import fs from 'node:fs'; // Pour vérifier l'existence du dossier

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 'uploads/' est le dossier où Multer enregistrera les fichiers temporairement
        // et finalement.
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique pour éviter les collisions et les problèmes de sécurité.
        // On conserve l'extension d'origine.
        const uniqueSuffix = uuidv4();
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

// 2. Définir des filtres pour la validation (Vérifier le type de fichier)
const fileFilter = (req, file, cb) => {
    // Accepter uniquement certains types MIME (images dans cet exemple)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accepter le fichier
    } else {
        cb(new Error('Type de fichier non supporté. Seules les images (JPEG, PNG, GIF, WebP) sont autorisées.'), false); // Rejeter le fichier
    }
};

// 3. Initialiser Multer avec la configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de taille de fichier: 5 MB (Vérifier la taille du fichier)
    }
});

export default upload;
