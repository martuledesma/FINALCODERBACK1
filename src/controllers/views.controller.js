import { cartsDao, productsDao } from "../dao/index.js";

export const renderProducts = async (req, res) => {
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const page = Number.parseInt(req.query.page, 10) || 1;
  const query = req.query.query;
  const sort = req.query.sort;
  const search = req.query.search;

  const result = await productsDao.getPaginated({ limit, page, query, sort, search });

  res.render("products", {
    title: "Kitana | Productos",
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    query,
    sort,
    search
  });
};

export const renderProductDetail = async (req, res) => {
  const product = await productsDao.getById(req.params.pid);

  res.render("productDetail", {
    title: `Kitana | ${product.title}`,
    product
  });
};

export const renderCart = async (req, res) => {
  const cart = await cartsDao.getById(req.params.cid);
  const total = cart.products.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  res.render("cart", {
    title: "Kitana | Carrito",
    cart,
    total
  });
};

export const renderRealTimeProducts = async (req, res) => {
  const products = await productsDao.getAll();

  res.render("realTimeProducts", {
    title: "Kitana | Tiempo real",
    products
  });
};
