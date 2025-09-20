export default (sequelize, DataTypes) => {
  const HistoriqueCourrier = sequelize.define('HistoriqueCourrier', {
    id_historique: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    id_courrier: {
        type: DataTypes.UUID,
        allowNull: false
      },
    action: { // Action effectuée (création, modification, suppression, tranfert etc.)
        type: DataTypes.STRING(255),
        allowNull: false
      },
    id_utilisateur: {
        type: DataTypes.UUID,
        allowNull: false
      },
      id_structure: {
        type: DataTypes.UUID,
        allowNull: true
      },
      id_structure_destinataire: {
        type: DataTypes.UUID,
        allowNull: true
      },
      date_historique: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Date par défaut à la date actuelle
      },
      id_type_courrier: {
        type: DataTypes.UUID,
        allowNull: true
      },
      reference_courrier: {
        type: DataTypes.STRING(253),
        allowNull: true
      },
      id_objet: {
          type: DataTypes.UUID,
          allowNull: true
      },
    note: {
      type: DataTypes.STRING(253),
      allowNull: true
    }
  }, {
    tableName: 'Historiques_Courrier',
    timestamps: true,
    underscored: true
  });
  
  return HistoriqueCourrier;   
};
    