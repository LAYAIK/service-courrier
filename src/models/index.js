import { Sequelize,DataTypes } from 'sequelize'; // Importe Sequelize et DataTypes directement
import sequelize from '../config/sequelizeInstance.js'; // Import the Sequelize instance
import TypeCourrier from './TypeCourrierModel.js';
import TypeDocument from './TypeDocumentModel.js';
import Archive from './ArchiveModel.js';
import Courrier from './CourrierModel.js';
import Document from './DocumentModel.js';
import HistoriqueCourrier from './HistoriqueCourrierModel.js';

const db = {};

// Initialisez les modèles avec la connexion Sequelize et DataTypes
db.HistoriqueCourrier = HistoriqueCourrier(sequelize, DataTypes);

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

db.Sequelize = Sequelize; // Sequelize est déjà importé en tant que classe
db.sequelize = sequelize; // La connexion est déjà importé

export default db; // L'exportation par défaut est déjà en place