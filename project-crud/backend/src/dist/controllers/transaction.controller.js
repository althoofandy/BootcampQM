import { v4 as uuidv4 } from "uuid";
import db from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();
import Jwt from "jsonwebtoken";
class TransactionController {
    createTransaction = async (req, res) => {
        const { totalPrice, products } = req.body;
        const cookies = req.cookies.token;
        const decoded = Jwt.verify(cookies, process.env.JWT_SECRET_KEY);
        let userId = "";
        if (typeof decoded === "object" && decoded !== null) {
            const encodedPayload = decoded.___;
            const userData = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf8"));
            userId = userData.id;
        }
        try {
            // 1. Simpan transaksi utama
            const transaction = await db.Transaction.create({
                id: uuidv4(),
                cashierId: userId,
                totalPrice,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // 2. Simpan detail transaksi
            const detailRecords = await db.TransactionDetail.create({
                id: uuidv4(),
                transactionId: transaction.id,
                products: products, // simpan array dalam 1 field
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await db.TransactionDetail.bulkCreate(detailRecords);
            // 3. Update stok produk
            for (const item of products) {
                console.log("cek qty:", item.qty);
                await db.Product.decrement("stock", {
                    by: item.qty,
                    where: { id: item.productId },
                });
            }
            res.status(201).json({ message: "Transaction created successfully" });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to create transaction" });
        }
    };
}
export default new TransactionController();
