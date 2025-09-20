
export default (sequelize, DataTypes) => {
  const Courrier = sequelize.define('Courrier', {
    id_courrier: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_type_courrier: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_status: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_archive: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_structure: {
      type: DataTypes.UUID,
      allowNull: true
    }, 
    id_utilisateur: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_structure_destunataire: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_priorite: {
      type: DataTypes.UUID,
      allowNull: true
    },
    id_objet: {
      type: DataTypes.UUID,
      allowNull: true
    },
    reference_courrier: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    note: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    date_reception: { // Date de réception du courrier
      type: DataTypes.DATE,
      allowNull: true
    },
    date_envoi: { // Date d'envoi du courrier
      type: DataTypes.DATE,
      allowNull: true
    },
    date_traitement: { // Date de traitement du courrier
      type: DataTypes.DATE,
      allowNull: true
    },
    est_archive: { // Indique si le courrier est archivé (true/false)
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    date_archivage: { // Date d'archivage du courrier
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'Courriers',
    timestamps: true,
    underscored: true
  });

  // les associations
  Courrier.associate = (models) => {
    Courrier.belongsTo(models.TypeCourrier, { foreignKey: 'id_type_courrier', targetKey: 'id_type_courrier', onUpdate: 'SET NULL', onDelete: 'CASCADE' });
    Courrier.hasMany(models.Document, { foreignKey: 'id_courrier',targetKey: 'id_courrier', onUpdate: 'SET NULL', onDelete: 'CASCADE' });
    Courrier.hasOne(models.Archive, { foreignKey: 'id_courrier', targetKey: 'id_courrier', onUpdate: 'SET NULL', onDelete: 'CASCADE' });
  };

  return Courrier;
}

