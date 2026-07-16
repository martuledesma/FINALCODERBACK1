import { ProductsMongoDAO } from "./mongo/products.dao.js";
import { CartsMongoDAO } from "./mongo/carts.dao.js";

export const productsDao = new ProductsMongoDAO();
export const cartsDao = new CartsMongoDAO();
