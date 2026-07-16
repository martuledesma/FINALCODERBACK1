import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/products.controller.js";
import { asyncHandler } from "../utils/errors.js";

export const productsRouter = Router();

productsRouter.get("/", asyncHandler(getProducts));
productsRouter.get("/:pid", asyncHandler(getProductById));
productsRouter.post("/", asyncHandler(createProduct));
productsRouter.put("/:pid", asyncHandler(updateProduct));
productsRouter.delete("/:pid", asyncHandler(deleteProduct));
