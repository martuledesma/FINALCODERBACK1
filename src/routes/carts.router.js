import { Router } from "express";
import {
  addProductToCart,
  clearCart,
  createCart,
  getCartById,
  removeProductFromCart,
  updateCartProductQuantity,
  updateCartProducts
} from "../controllers/carts.controller.js";
import { asyncHandler } from "../utils/errors.js";

export const cartsRouter = Router();

cartsRouter.post("/", asyncHandler(createCart));
cartsRouter.get("/:cid", asyncHandler(getCartById));
cartsRouter.post("/:cid/products/:pid", asyncHandler(addProductToCart));
cartsRouter.delete("/:cid/products/:pid", asyncHandler(removeProductFromCart));
cartsRouter.put("/:cid", asyncHandler(updateCartProducts));
cartsRouter.put("/:cid/products/:pid", asyncHandler(updateCartProductQuantity));
cartsRouter.delete("/:cid", asyncHandler(clearCart));
