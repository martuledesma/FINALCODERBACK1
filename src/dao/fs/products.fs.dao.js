import path from "path";
import { fileURLToPath } from "url";
import { FileManager } from "./fileManager.js";
import { AppError } from "../../utils/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProductsFsDAO {
  constructor() {
    this.manager = new FileManager(path.join(__dirname, "../../../data/products.json"));
  }

  async getAll() {
    return this.manager.read();
  }

  async getById(id) {
    const products = await this.getAll();
    const product = products.find((item) => item.id === id);
    if (!product) throw new AppError("Producto no encontrado", 404);
    return product;
  }

  async create(data) {
    const products = await this.getAll();
    const newProduct = { id: crypto.randomUUID(), ...data };
    products.push(newProduct);
    await this.manager.write(products);
    return newProduct;
  }

  async update(id, data) {
    const products = await this.getAll();
    const index = products.findIndex((item) => item.id === id);
    if (index === -1) throw new AppError("Producto no encontrado", 404);

    products[index] = { ...products[index], ...data, id };
    await this.manager.write(products);
    return products[index];
  }

  async delete(id) {
    const products = await this.getAll();
    const product = products.find((item) => item.id === id);
    if (!product) throw new AppError("Producto no encontrado", 404);

    await this.manager.write(products.filter((item) => item.id !== id));
    return product;
  }
}
