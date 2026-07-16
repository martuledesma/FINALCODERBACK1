const catalogMessage = document.querySelector("#catalog-message");

document.querySelectorAll(".add-cart-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const result = await window.kitanaCart.addProduct(button.dataset.productId, 1);

    catalogMessage.textContent = result.ok
      ? "Producto agregado al carrito."
      : result.error || "No se pudo agregar el producto.";
  });
});
