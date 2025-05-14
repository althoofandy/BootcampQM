import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
    class Transaction extends Model {
        static associate(models) {
            Transaction.belongsTo(models.User, {
                foreignKey: "cashierId",
                as: "cashier",
            });
            Transaction.hasMany(models.TransactionDetail, {
                foreignKey: "transactionId",
                as: "details",
            });
        }
    }
    Transaction.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cashierId: {
            type: DataTypes.UUID,
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
        modelName: "Transaction",
        tableName: "transactions",
    });
    return Transaction;
};
