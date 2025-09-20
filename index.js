import app from './app.js';
import dotenv from 'dotenv'; // Si vous utilisez dotenv pour charger les variables d'environnement
import db from './src/models/index.js'; // Importe l'objet 'db' depuis votre fichier models/index.js (avec l'extension .js)
dotenv.config();
const PORT = process.env.PORT || 3002;

async function runApplication() {
    try {
        // Connexion à la base de données (gérée par l'import de db)
        // Vous pouvez ajouter une vérification de connexion explicite si vous le souhaitez
        await db.sequelize.authenticate();
        console.log('Connecté à PostgreSQL avec succès !');

        // Ordre correct de synchronisation Sequelize
        // Vérifiez très attentivement ces lignes pour les fautes de frappe ou les noms de modèles incorrects
        
        await db.Archive.sync({ alter: true });
        await db.TypeCourrier.sync({ alter: true });
        await db.TypeDocument.sync({ alter: true });
        await db.Document.sync({ alter: true });
        await db.Courrier.sync({ alter: true });
        await db.HistoriqueCourrier.sync({ alter: true });

        console.log('Tables synchronisées avec succès.');

        app.listen(PORT, () => {
            console.log(`Le serveur est démarré sur le port ${PORT}`);
        });

    } catch (error) {
        console.error('Erreur lors de la synchronisation des modèles ou des opérations:', error);
        // C'est une bonne pratique de quitter le processus si la synchronisation de la base de données échoue de manière critique
        process.exit(1);
    }
}

runApplication();