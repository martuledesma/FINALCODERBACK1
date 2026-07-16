const form = document.querySelector(".add-cart-form");
const message = document.querySelector("#cart-message");
const quantityInput = form.elements.quantity;
const quantityValue = form.querySelector(".quantity-value");

const normalizeQuantity = () => {
  const quantity = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);
  quantityInput.value = quantity;
  quantityValue.textContent = quantity;
  return quantity;
};

form.querySelectorAll("[data-quantity-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentQuantity = normalizeQuantity();
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
  const quantity = normalizeQuantity();
  const result = await window.kitanaCart.addProduct(productId, quantity);

  message.textContent = result.ok
    ? `Producto agregado al carrito. Cantidad: ${quantity}.`
    : result.error || "No se pudo agregar el producto.";
});
