const catalogMessage = document.querySelector("#catalog-message");

document.querySelectorAll(".add-cart-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const cartId = window.prompt("Pegá el ID del carrito para agregar este producto:");
    if (!cartId) return;

    const response = await fetch(`/api/carts/${cartId}/products/${button.dataset.productId}`, {
      method: "POST"
    });
    const result = await response.json();

    catalogMessage.textContent = response.ok
      ? "Producto agregado al carrito."
      : result.error || "No se pudo agregar el producto.";
  });
});
