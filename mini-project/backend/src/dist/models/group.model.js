import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
    class Group extends Model {
        static associate(models) {
            // Relasi: Group punya banyak children
            Group.hasMany(models.Group, {
                foreignKey: "parentId",
                as: "children",
            });
            // Relasi: Group bisa punya satu parent
            Group.belongsTo(models.Group, {
                foreignKey: "parentId",
                as: "parent",
            });
        }
    }
    Group.init({
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.CHAR(36),
            allowNull: true,
        },
        code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        tag: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        active: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: "Group",
        tableName: "group",
    });
    return Group;
};
