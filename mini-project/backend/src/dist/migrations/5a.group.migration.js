import { DataTypes } from "sequelize";
export async function up(queryInterface) {
    await queryInterface.createTable("group", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "group",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        tag: {
            type: DataTypes.STRING,
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
    });
}
export async function down(queryInterface) {
    await queryInterface.dropTable("group");
}
