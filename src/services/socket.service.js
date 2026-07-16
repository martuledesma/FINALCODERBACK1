let ioInstance = null;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const emitProductsUpdated = async (products) => {
  if (ioInstance) {
    ioInstance.emit("productsUpdated", products);
  }
};
