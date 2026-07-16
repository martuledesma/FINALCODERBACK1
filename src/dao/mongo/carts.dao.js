import { CartModel } from "../../models/cart.model.js";
import { ProductModel } from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

export class CartsMongoDAO {
  async create() {
    return CartModel.create({ products: [] });
  }

  async getById(id) {
    const cart = await CartModel.findById(id).populate("products.product").lean();
    if (!cart) throw new AppError("Carrito no encontrado", 404);
    return cart;
  }

  async addProduct(cartId, productId) {
    const product = await ProductModel.findById(productId).lean();
    if (!product) throw new AppError("Producto no encontrado", 404);

    const cart = await CartModel.findById(cartId);
    if (!cart) throw new AppError("Carrito no encontrado", 404);

    const item = cart.products.find((entry) => entry.product.toString() === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return this.getById(cartId);
  }

  async removeProduct(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new AppError("Carrito no encontrado", 404);

    cart.products = cart.products.filter((entry) => entry.product.toString() !== productId);
    await cart.save();

    return this.getById(cartId);
  }

  async updateProducts(cartId, products) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new AppError("Carrito no encontrado", 404);

    cart.products = products.map((entry) => ({
      product: entry.product || entry.productId,
      quantity: entry.quantity
    }));

    await cart.save();
    return this.getById(cartId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new AppError("Carrito no encontrado", 404);

    const item = cart.products.find((entry) => entry.product.toString() === productId);
    if (!item) throw new AppError("El producto no existe en el carrito", 404);

    item.quantity = quantity;
    await cart.save();

    return this.getById(cartId);
  }

  async clear(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new AppError("Carrito no encontrado", 404);

    cart.products = [];
    await cart.save();

    return this.getById(cartId);
  }
}
