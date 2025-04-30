import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
class ProductController {
    async getCartByUser(req, res) {
        try {
            const { userId } = req.params;
            const carts = await db.Cart.findAll({
                attributes: ["id", "quantity", "totalPrice"],
                where: { userId },
                include: [
                    {
                        model: db.Product,
                        as: "product",
                        attributes: ["id", "name", "price"],
                    },
                ],
            });
            const totalAllPrice = carts.reduce((total, cart) => total + cart.totalPrice, 0);
            const totalAllPriceInRupiah = totalAllPrice.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            });
            res.json({
                status: "success",
                message: "Carts fetched successfully",
                data: { carts, totalAllPriceInRupiah },
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    async addToCart(req, res) {
        try {
            const { userId } = req.params;
            const { productId, quantity = 1 } = req.body;
            const product = await db.Product.findByPk(productId);
            if (!product) {
                res.status(404).json({ status: "error", message: "Product not found" });
                return;
            }
            const cart = await db.Cart.create({
                id: uuidv4(),
                userId,
                productId,
                quantity,
                totalPrice: product.price * quantity,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(cart);
            res.json({
                status: "success",
                message: "Cart created successfully",
                data: cart,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    async deleteCart(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await db.Cart.destroy({ where: { id: cartId } });
            if (!cart) {
                res.status(404).json({ status: "error", message: "Cart not found" });
                return;
            }
            res.json({
                status: "success",
                message: "Cart deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
}
export default new ProductController();
