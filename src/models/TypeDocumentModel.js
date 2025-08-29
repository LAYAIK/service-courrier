export default (sequelize, DataTypes) => {
const TypeDocument = sequelize.define('TypeDocument', {
  id_type_document: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Types_Document',
  timestamps: true,
  underscored: true
});
 
TypeDocument.associate = (models) => {
  TypeDocument.hasMany(models.Document, { foreignKey: 'id_type_document'});
};

return TypeDocument;

};

