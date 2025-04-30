import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Cart, {
                foreignKey: "userId",
                as: "carts",
            });
        }
    }
    User.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
        modelName: "User",
        tableName: "users",
    });
    return User;
};
