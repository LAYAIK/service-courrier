export default (sequelize, DataTypes) => {
const Archive = sequelize.define("Archive", {
    id_archive: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    id_utilisateur: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date_archivage: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Date d'archivage par défaut à la date actuelle
    }
}, {
    tableName: "Archives",
    timestamps: true,
    underscored: true
});
Archive.associate = function (models) {
    Archive.hasMany(models.Document, { foreignKey: "id_archive" });
    Archive.hasMany(models.Courrier, { foreignKey: "id_archive", targetKey: "id_archive", onUpdate: "CASCADE", onDelete: "CASCADE" });
};

return Archive;
};