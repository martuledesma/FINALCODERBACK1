import { Router } from "express";
import {
  renderCart,
  renderProductDetail,
  renderProducts,
  renderRealTimeProducts
} from "../controllers/views.controller.js";
import { asyncHandler } from "../utils/errors.js";

export const viewsRouter = Router();

viewsRouter.get("/", (req, res) => res.redirect("/products"));
viewsRouter.get("/products", asyncHandler(renderProducts));
viewsRouter.get("/products/:pid", asyncHandler(renderProductDetail));
viewsRouter.get("/carts/:cid", asyncHandler(renderCart));
viewsRouter.get("/realtimeproducts", asyncHandler(renderRealTimeProducts));
