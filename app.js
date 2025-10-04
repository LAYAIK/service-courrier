import express from "express";
import bodyParser from 'body-parser';
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import 'dotenv/config'; // charge les variables d'environnement à partir du fichier .env
import swaggerSetup from './swagger.js';
import ApiRoutes from './src/routes/index.js'; // importation des routes d'authentification
import path from 'path';
import fs from 'node:fs';
import cors from 'cors';


const app = express(); // création de l'application express
app.use(bodyParser.json()); // pour parser le corps des requêtes JSON


// Configuration de CORS pour autoriser les requêtes depuis le frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's origin
  credentials: true, // Allow cookies and authentication headers
};
app.use(cors(corsOptions));

const logger = pino({ 
    level: process.env.LOG_LEVEL || 'info',  // niveau de log, par défaut 'info'
    transport: {
        target: 'pino-pretty', // pour formater les logs de manière lisible
        options: {
            
            ignore: 'pid,hostname', // ignorer les informations de processus et d'hôte
            translateTime: 'SYS:standard', // pour afficher l'heure dans un format standard
            colorize: true  // pour colorer les logs dans la console
        }
    }
});

app.use(pinoHttp({ logger })); // middleware pour logger les requêtes HTTP

swaggerSetup(app); // initialisation de swagger

ApiRoutes(app); // initialisation des routes


// Créer le dossier 'uploads' s'il n'existe pas
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log(`Dossier 'uploads' créé à : ${uploadsDir}`);
}

// Servir les fichiers statiques du dossier 'public' (pour le formulaire HTML)
app.use(express.static('public'));

// Servir les fichiers uploadés depuis le dossier 'uploads'
//app.use('uploads', express.static('uploadsDir'));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


export default app; // exporte l'application express