import { Sequelize, DataTypes } from 'sequelize'; // Importe Sequelize et DataTypes directement
import fs from 'node:fs'; // Utilise le préfixe 'node:' pour les modules Node.js intégrés
import path from 'node:path';
import { fileURLToPath } from 'node:url'; // Pour gérer __dirname dans les modules ES

// Pour obtenir l'équivalent de __dirname dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Détermine l'environnement (development, test, production)
const env = process.env.NODE_ENV || 'development';

// Charge le fichier de configuration JSON
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))[env]; // Accède à la section spécifique de l'environnement

let sequelize;
// Vérifie si la configuration SSL est présente et nécessaire
if (config.use_env_variable) { // Optionnel: si vous utilisez une variable d'environnement pour l'URL de la DB
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Ici, nous passons les options de connexion
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
      port: config.port,
      logging: config.logging ? console.log : false, // Si config.logging est true, utilise console.log, sinon false
      dialectOptions: {
        ssl: config.ssl ? { // Applique la configuration SSL si config.ssl est true
          require: config.dialectOptions && config.dialectOptions.ssl && config.dialectOptions.ssl.require !== undefined ? config.dialectOptions.ssl.require : true,
          rejectUnauthorized: config.dialectOptions && config.dialectOptions.ssl && config.dialectOptions.ssl.rejectUnauthorized !== undefined ? config.dialectOptions.ssl.rejectUnauthorized : false
        } : false // Si config.ssl est false, n'active pas SSL
      }
    }
  );
}

const db = {}; // Objet pour stocker les modèles

db.Sequelize = Sequelize; // Sequelize est déjà importé en tant que classe
db.sequelize = sequelize; // La connexion est déjà importé

// Importez et définissez tous vos modèles ici
// Assurez-vous que les noms des fichiers correspondent et que vous les ajoutez à l'objet db

import TypeCourrier from './TypeCourrierModel.js';
import TypeDocument from './TypeDocumentModel.js';
import Archive from './ArchiveModel.js';
import Courrier from './CourrierModel.js';
import Document from './DocumentModel.js';

db.TypeCourrier = TypeCourrier(sequelize, DataTypes);
db.TypeDocument = TypeDocument(sequelize, DataTypes);
db.Archive = Archive(sequelize, DataTypes);
db.Courrier = Courrier(sequelize, DataTypes);
db.Document = Document(sequelize, DataTypes);


// Définissez les associations après que tous les modèles ont été chargés
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
export default db; // L'exportation par défaut est déjà en place