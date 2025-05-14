import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class TransactionDetail extends Model {
    static associate(models: any) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: "transactionId",
        as: "transaction",
      });
    }
  }

  TransactionDetail.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      products: {
        type: DataTypes.JSON,
        allowNull: false, // Simpan snapshot produk (bisa termasuk name, price, quantity, dst.)
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
    },
    {
      sequelize,
      modelName: "TransactionDetail",
      tableName: "transaction_details",
    }
  );

  return TransactionDetail;
};
