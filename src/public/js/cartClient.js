const CART_STORAGE_KEY = "kitanaCartId";

const getStoredCartId = () => localStorage.getItem(CART_STORAGE_KEY);

const storeCartId = (cartId) => {
  localStorage.setItem(CART_STORAGE_KEY, cartId);
  updateCartLink(cartId);
};

const updateCartLink = (cartId = getStoredCartId()) => {
  const cartLink = document.querySelector("#cart-link");
  if (cartLink && cartId) {
    cartLink.href = `/carts/${cartId}`;
  }
};

const createCart = async () => {
  const response = await fetch("/api/carts", { method: "POST" });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo crear el carrito.");
  }

  const cartId = result.payload._id;
  storeCartId(cartId);
  return cartId;
};

const getCartId = async () => getStoredCartId() || createCart();

const getCart = async (cartId) => {
  const response = await fetch(`/api/carts/${cartId}`);
  const result = await response.json();

  if (!response.ok) {
    localStorage.removeItem(CART_STORAGE_KEY);
    throw new Error(result.error || "No se pudo obtener el carrito.");
  }

  return result.payload;
};

const updateProductQuantity = async (cartId, productId, quantity) => {
  const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity })
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo actualizar la cantidad.");
  }

  return result.payload;
};

const addProduct = async (productId, quantity = 1) => {
  try {
    const parsedQuantity = Math.max(1, Number(quantity) || 1);
    const cartId = await getCartId();
    const cart = await getCart(cartId);
    const currentItem = cart.products.find((item) => item.product._id === productId);

    if (currentItem) {
      await updateProductQuantity(cartId, productId, currentItem.quantity + parsedQuantity);
    } else {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST"
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo agregar el producto.");
      }

      if (parsedQuantity > 1) {
        await updateProductQuantity(cartId, productId, parsedQuantity);
      }
    }

    updateCartLink(cartId);
    return { ok: true, cartId };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

updateCartLink();

window.kitanaCart = {
  addProduct,
  getCartId
};
