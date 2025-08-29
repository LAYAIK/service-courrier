export default (sequelize, DataTypes) => { 
const TypeCourrier = sequelize.define('TypeCourrier', {
  id_type_courrier: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true // Assumons que le type de courrier est unique
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Types_Courrier',
  timestamps: true,
  underscored: true
});
// associations
TypeCourrier.associate = (models) => {
  TypeCourrier.hasMany(models.Courrier, { foreignKey: 'id_type_courrier' });
}
return TypeCourrier;
};