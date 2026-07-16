const form = document.querySelector(".add-cart-form");
const message = document.querySelector("#cart-message");
const quantityInput = form.elements.quantity;

form.querySelectorAll("[data-quantity-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentQuantity = Number(quantityInput.value) || 1;
    const nextQuantity =
      button.dataset.quantityAction === "plus"
        ? currentQuantity + 1
        : Math.max(1, currentQuantity - 1);

    quantityInput.value = nextQuantity;
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productId = form.dataset.productId;
  const quantity = Number(quantityInput.value) || 1;
  const result = await window.kitanaCart.addProduct(productId, quantity);

  message.textContent = result.ok
    ? `Producto agregado al carrito. Cantidad: ${quantity}.`
    : result.error || "No se pudo agregar el producto.";
});
