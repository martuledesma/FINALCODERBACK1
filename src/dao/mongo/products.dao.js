import { ProductModel } from "../../models/product.model.js";
import { AppError } from "../../utils/errors.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class ProductsMongoDAO {
  async getPaginated({ limit = 10, page = 1, query, sort, search }) {
    const filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    const sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    return ProductModel.paginate
      ? ProductModel.paginate(filter, { limit, page, sort: sortOption, lean: true })
      : this.paginateWithoutPlugin(filter, { limit, page, sort: sortOption });
  }

  async paginateWithoutPlugin(filter, { limit, page, sort }) {
    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      ProductModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalDocs / limit) || 1;

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    };
  }

  async getAll() {
    return ProductModel.find().sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new AppError("Producto no encontrado", 404);
    return product;
  }

  async create(data) {
    try {
      return await ProductModel.create(data);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Ya existe un producto con ese codigo", 400);
      }
      throw error;
    }
  }

  async update(id, data) {
    delete data._id;
    delete data.id;

    const product = await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).lean();

    if (!product) throw new AppError("Producto no encontrado", 404);
    return product;
  }

  async delete(id) {
    const product = await ProductModel.findByIdAndDelete(id).lean();
    if (!product) throw new AppError("Producto no encontrado", 404);
    return product;
  }
}
