import { cartsDao } from "../dao/index.js";
import { AppError } from "../utils/errors.js";

const validateQuantity = (quantity) => {
  const parsedQuantity = Number.parseInt(quantity, 10);

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw new AppError("La cantidad debe ser un numero entero mayor a 0", 400);
  }

  return parsedQuantity;
};

const validateProductsArray = (products) => {
  if (!Array.isArray(products)) {
    throw new AppError("El body debe incluir un array products", 400);
  }

  products.forEach((item) => {
    if ((!item.product && !item.productId) || !item.quantity) {
      throw new AppError("Cada item debe incluir product o productId y quantity", 400);
    }
    validateQuantity(item.quantity);
  });
};

export const createCart = async (req, res) => {
  const cart = await cartsDao.create();
  res.status(201).json({ status: "success", payload: cart });
};

export const getCartById = async (req, res) => {
  const cart = await cartsDao.getById(req.params.cid);
  res.json({ status: "success", payload: cart });
};

export const addProductToCart = async (req, res) => {
  const cart = await cartsDao.addProduct(req.params.cid, req.params.pid);
  res.json({ status: "success", payload: cart });
};

export const removeProductFromCart = async (req, res) => {
  const cart = await cartsDao.removeProduct(req.params.cid, req.params.pid);
  res.json({ status: "success", payload: cart });
};

export const updateCartProducts = async (req, res) => {
  validateProductsArray(req.body.products);
  const cart = await cartsDao.updateProducts(req.params.cid, req.body.products);
  res.json({ status: "success", payload: cart });
};

export const updateCartProductQuantity = async (req, res) => {
  const quantity = validateQuantity(req.body.quantity);
  const cart = await cartsDao.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  res.json({ status: "success", payload: cart });
};

export const clearCart = async (req, res) => {
  const cart = await cartsDao.clear(req.params.cid);
  res.json({ status: "success", payload: cart });
};
