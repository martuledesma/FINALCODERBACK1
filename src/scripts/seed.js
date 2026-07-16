import "dotenv/config";
import mongoose from "mongoose";
import { ProductModel } from "../models/product.model.js";

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";

const products = [
  {
    title: "Remera Kitana Classic",
    description: "Remera de algodon suave con corte urbano.",
    code: "KIT-REM-001",
    price: 18900,
    status: true,
    stock: 25,
    category: "remeras",
    sizes: ["XS", "S", "M", "L"],
    thumbnails: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"]
  },
  {
    title: "Jean Wide Leg Aura",
    description: "Jean tiro alto de calce amplio para uso diario.",
    code: "KIT-PAN-001",
    price: 45900,
    status: true,
    stock: 12,
    category: "pantalones",
    sizes: ["34", "36", "38", "40"],
    thumbnails: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246"]
  },
  {
    title: "Campera Denim Noche",
    description: "Campera de jean azul oscuro con bolsillos frontales.",
    code: "KIT-CAM-001",
    price: 62900,
    status: true,
    stock: 8,
    category: "camperas",
    sizes: ["S", "M", "L"],
    thumbnails: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"]
  },
  {
    title: "Vestido Midi Brisa",
    description: "Vestido midi liviano ideal para media estacion.",
    code: "KIT-VES-001",
    price: 38900,
    status: true,
    stock: 15,
    category: "vestidos",
    sizes: ["XS", "S", "M"],
    thumbnails: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c"]
  },
  {
    title: "Cinturon Minimal",
    description: "Cinturon negro con hebilla metalica.",
    code: "KIT-ACC-001",
    price: 9900,
    status: true,
    stock: 30,
    category: "accesorios",
    sizes: ["Unico"],
    thumbnails: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc"]
  },
  {
    title: "Buzo Oversize Cobre",
    description: "Buzo frizado oversize con cuello redondo.",
    code: "KIT-BUZ-001",
    price: 34900,
    status: true,
    stock: 18,
    category: "buzos",
    sizes: ["S", "M", "L", "XL"],
    thumbnails: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7"]
  }
];

await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
await ProductModel.deleteMany({});
await ProductModel.insertMany(products);
await mongoose.disconnect();

console.log("Productos Kitana cargados correctamente");
