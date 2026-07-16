const cartMessage = document.querySelector("#cart-message");
const checkoutButton = document.querySelector("#fake-checkout");

const requestCartUpdate = async (url, options = {}) => {
  const response = await fetch(url, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo actualizar el carrito.");
  }

  window.location.reload();
};

document.querySelectorAll(".cart-item").forEach((item) => {
  item.addEventListener("click", async (event) => {
    const actionButton = event.target.closest("[data-cart-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.cartAction;
    const productId = item.dataset.productId;
    const quantityElement = item.querySelector(".cart-quantity span");
    const currentQuantity = Number(quantityElement.textContent) || 1;

    try {
      if (action === "remove") {
        await requestCartUpdate(`/api/carts/${window.currentCartId}/products/${productId}`, {
          method: "DELETE"
        });
        return;
      }

      const nextQuantity = action === "plus" ? currentQuantity + 1 : currentQuantity - 1;

      if (nextQuantity < 1) {
        await requestCartUpdate(`/api/carts/${window.currentCartId}/products/${productId}`, {
          method: "DELETE"
        });
        return;
      }

      await requestCartUpdate(`/api/carts/${window.currentCartId}/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity })
      });
    } catch (error) {
      cartMessage.textContent = error.message;
    }
  });
});

checkoutButton?.addEventListener("click", () => {
  cartMessage.textContent = "Compra simulada: este boton es demostrativo para la entrega.";
});
