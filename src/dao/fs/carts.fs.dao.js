import path from "path";
import { fileURLToPath } from "url";
import { FileManager } from "./fileManager.js";
import { AppError } from "../../utils/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CartsFsDAO {
  constructor() {
    this.manager = new FileManager(path.join(__dirname, "../../../data/carts.json"));
  }

  async create() {
    const carts = await this.manager.read();
    const cart = { id: crypto.randomUUID(), products: [] };
    carts.push(cart);
    await this.manager.write(carts);
    return cart;
  }

  async getById(id) {
    const carts = await this.manager.read();
    const cart = carts.find((item) => item.id === id);
    if (!cart) throw new AppError("Carrito no encontrado", 404);
    return cart;
  }
}
