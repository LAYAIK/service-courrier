export default (sequelize, DataTypes) => {
const Document = sequelize.define('Document', {
  id_document: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  libelle: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  chemin_serveur: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  type_mime: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  taille: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Documents',
  timestamps: true,
  underscored: true
});
// associations
Document.associate = (models) => {
  Document.belongsTo(models.TypeDocument, { foreignKey: 'id_type_document', targetKey: 'id_type_document', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
  Document.belongsTo(models.Courrier, { foreignKey: 'id_courrier', targetKey: 'id_courrier', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
  Document.belongsTo(models.Archive, { foreignKey: 'id_archive', targetKey: 'id_archive', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
}

return Document;
};