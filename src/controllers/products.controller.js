import { productsDao } from "../dao/index.js";
import { AppError } from "../utils/errors.js";
import { buildPageLink } from "../utils/paginationLinks.js";
import { emitProductsUpdated } from "../services/socket.service.js";

const requiredFields = ["title", "description", "code", "price", "stock", "category"];

const validateProduct = (body) => {
  const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === "");
  if (missingFields.length) {
    throw new AppError(`Faltan campos obligatorios: ${missingFields.join(", ")}`, 400);
  }
};

const validatePagination = (req) => {
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const page = Number.parseInt(req.query.page, 10) || 1;
  const sort = req.query.sort;

  if (limit < 1 || page < 1) {
    throw new AppError("Los parametros limit y page deben ser mayores a 0", 400);
  }

  if (sort && sort !== "asc" && sort !== "desc") {
    throw new AppError("El parametro sort solo puede ser asc o desc", 400);
  }

  return {
    limit,
    page,
    query: req.query.query,
    sort,
    search: req.query.search
  };
};

export const getProducts = async (req, res) => {
  const options = validatePagination(req);
  const result = await productsDao.getPaginated(options);

  res.json({
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? buildPageLink(req, result.prevPage) : null,
    nextLink: result.hasNextPage ? buildPageLink(req, result.nextPage) : null
  });
};

export const getProductById = async (req, res) => {
  const product = await productsDao.getById(req.params.pid);
  res.json({ status: "success", payload: product });
};

export const createProduct = async (req, res) => {
  validateProduct(req.body);

  const product = await productsDao.create(req.body);
  const products = await productsDao.getAll();
  await emitProductsUpdated(products);

  res.status(201).json({ status: "success", payload: product });
};

export const updateProduct = async (req, res) => {
  const product = await productsDao.update(req.params.pid, req.body);
  const products = await productsDao.getAll();
  await emitProductsUpdated(products);

  res.json({ status: "success", payload: product });
};

export const deleteProduct = async (req, res) => {
  const product = await productsDao.delete(req.params.pid);
  const products = await productsDao.getAll();
  await emitProductsUpdated(products);

  res.json({ status: "success", payload: product });
};
