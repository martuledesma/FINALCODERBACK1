# Kitana Ecommerce Backend

Proyecto final backend para una tienda de ropa llamada **Kitana**.

## Tecnologias

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Socket.IO
- DAO MongoDB y DAO FileSystem

## Instalacion

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Si no tenes MongoDB instalado, usa MongoDB Atlas. En ese caso cambia `MONGO_URI` en `.env` por tu URL de Atlas, por ejemplo:

```txt
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce
```

La consigna no exige Atlas; exige MongoDB con Mongoose. Atlas y Mongo local sirven.

El servidor corre en:

```txt
http://localhost:8080
```

## Rutas principales

- `GET /api/products`
- `GET /api/products/:pid`
- `POST /api/products`
- `PUT /api/products/:pid`
- `DELETE /api/products/:pid`
- `POST /api/carts`
- `GET /api/carts/:cid`
- `POST /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid/products/:pid`
- `PUT /api/carts/:cid`
- `PUT /api/carts/:cid/products/:pid`
- `DELETE /api/carts/:cid`

## Vistas

- `/products`
- `/products/:pid`
- `/carts/:cid`
- `/realtimeproducts`
