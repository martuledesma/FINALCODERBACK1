import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase } from "./config/database.js";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { errorHandler } from "./utils/errors.js";
import { setSocketServer } from "./services/socket.service.js";
import { productsDao } from "./dao/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8080;

await connectDatabase();

app.engine(
  "handlebars",
  engine({
    helpers: {
      formatPrice: (value) => new Intl.NumberFormat("es-AR").format(value),
      multiply: (a, b) => a * b,
      id: (value) => value?.toString?.() || value
    }
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(errorHandler);

setSocketServer(io);

io.on("connection", async (socket) => {
  const products = await productsDao.getAll();
  socket.emit("productsUpdated", products);
});

httpServer.listen(PORT, () => {
  console.log(`Servidor Kitana escuchando en http://localhost:${PORT}`);
});
